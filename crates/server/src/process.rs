use anyhow::{Context, Result};
use bytes::Bytes;
use command_group::{AsyncCommandGroup, AsyncGroupChild};
use serde::Serialize;
use serde_json::{Value, json};
use std::{
    path::Path,
    process::Stdio,
    time::{Duration, Instant},
};
use tokio::{
    io::{AsyncRead, AsyncReadExt},
    process::Command,
    sync::mpsc,
};
use tokio_util::sync::CancellationToken;

pub struct Process(pub AsyncGroupChild);

impl Drop for Process {
    fn drop(&mut self) {
        // 取消 HTTP 请求或异步任务时也必须回收整个进程树。
        let _ = self.0.start_kill();
    }
}

pub fn command(tool: &str) -> Command {
    let mut command = Command::new(tool);
    command.kill_on_drop(true);
    #[cfg(windows)]
    command.creation_flags(0x0800_0000);
    command
}

pub fn spawn(command: &mut Command) -> Result<Process> {
    Ok(Process(
        command
            .group()
            .kill_on_drop(true)
            .spawn()
            .context("无法启动工具链进程")?,
    ))
}

#[derive(Default)]
pub struct Utf8Output(Vec<u8>);

impl Utf8Output {
    pub fn decode(&mut self, bytes: &[u8], end: bool) -> String {
        self.0.extend_from_slice(bytes);
        let mut consumed = self.0.len();
        if !end
            && let Err(error) = std::str::from_utf8(&self.0)
            && error.error_len().is_none()
        {
            consumed = error.valid_up_to();
        }
        let text = String::from_utf8_lossy(&self.0[..consumed]).into_owned();
        self.0.drain(..consumed);
        text
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunResult {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
    pub elapsed: u128,
    pub output_exceeded: bool,
}

pub type Events = mpsc::Sender<Bytes>;

pub fn emit(events: &Option<Events>, event: Value) -> Result<()> {
    if let Some(events) = events {
        events
            .try_send(Bytes::from(format!("{event}\n")))
            .context("输出连接已关闭或读取过慢")?;
    }
    Ok(())
}

async fn read_pipe(
    mut pipe: impl AsyncRead + Unpin,
    channel: usize,
    tx: mpsc::Sender<(usize, Vec<u8>)>,
) {
    let mut buffer = [0; 8192];
    loop {
        match pipe.read(&mut buffer).await {
            Ok(0) | Err(_) => break,
            Ok(size) => {
                if tx.send((channel, buffer[..size].to_vec())).await.is_err() {
                    break;
                }
            }
        }
    }
}

pub async fn execute(
    directory: &Path,
    args: &[&str],
    cancel: CancellationToken,
    events: Option<Events>,
    limit: usize,
) -> Result<RunResult> {
    let started = Instant::now();
    let mut cmd = command("cargo");
    cmd.args(args)
        .current_dir(directory)
        .env(
            "CARGO_TARGET_DIR",
            std::env::temp_dir().join("rust-path-cargo-target"),
        )
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    let mut child = spawn(&mut cmd)?;
    let stdout = child.0.inner().stdout.take().context("缺少 stdout")?;
    let stderr = child.0.inner().stderr.take().context("缺少 stderr")?;
    let (tx, mut rx) = mpsc::channel(32);
    let out_task = tokio::spawn(read_pipe(stdout, 0, tx.clone()));
    let err_task = tokio::spawn(read_pipe(stderr, 1, tx));
    let mut output = [Vec::new(), Vec::new()];
    let mut decoders = [Utf8Output::default(), Utf8Output::default()];
    let deadline = tokio::time::sleep(Duration::from_secs(120));
    tokio::pin!(deadline);
    let mut reason = String::new();
    let mut exceeded = false;
    let mut status = None;
    let mut pipes_closed = false;
    let mut poll = tokio::time::interval(Duration::from_millis(25));
    loop {
        tokio::select! {
            _ = cancel.cancelled(), if reason.is_empty() => reason = "执行已停止".into(),
            _ = &mut deadline, if reason.is_empty() => reason = "执行超过 120 秒，已停止；首次依赖构建可重试利用缓存".into(),
            _ = async { if let Some(tx) = &events { tx.closed().await } else { std::future::pending::<()>().await } }, if reason.is_empty() => reason = "输出连接已关闭".into(),
            chunk = rx.recv(), if !pipes_closed => {
                if let Some((channel, bytes)) = chunk {
                    let remaining = limit.saturating_sub(output[channel].len());
                    let accepted = &bytes[..remaining.min(bytes.len())];
                    output[channel].extend_from_slice(accepted);
                    let text = decoders[channel].decode(accepted, false);
                    if !text.is_empty() && reason.is_empty()
                        && let Err(error) = emit(&events, json!({"type":"output", "channel": if channel == 0 {"stdout"} else {"stderr"}, "text":text})) {
                            reason = error.to_string();
                        }
                    if bytes.len() > remaining {
                        exceeded = true;
                        reason = format!("输出超过 {limit} 字节，已停止");
                    }
                } else {
                    pipes_closed = true;
                }
            }
            _ = poll.tick() => {
                if status.is_none() {
                    status = child.0.try_wait()?;
                }
            }
        }
        if !reason.is_empty() {
            let _ = child.0.start_kill();
        }
        if pipes_closed && status.is_some() {
            break;
        }
    }
    out_task.await?;
    err_task.await?;
    for (channel, decoder) in decoders.iter_mut().enumerate() {
        let text = decoder.decode(&[], true);
        if !text.is_empty() && reason.is_empty() {
            let _ = emit(
                &events,
                json!({"type":"output", "channel": if channel == 0 {"stdout"} else {"stderr"}, "text":text}),
            );
        }
    }
    let stderr = String::from_utf8_lossy(&output[1]).into_owned();
    Ok(RunResult {
        success: status.is_some_and(|value| value.success()) && reason.is_empty(),
        stdout: String::from_utf8_lossy(&output[0]).into_owned(),
        stderr: if reason.is_empty() {
            stderr
        } else {
            format!("{stderr}\n{reason}")
        },
        elapsed: started.elapsed().as_millis(),
        output_exceeded: exceeded,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn utf8_chunk_boundaries_preserve_chinese() {
        let mut decoder = Utf8Output::default();
        assert_eq!(decoder.decode(&[0xe4, 0xbd], false), "");
        assert_eq!(decoder.decode(&[0xa0, 0xe5], false), "你");
        assert_eq!(decoder.decode(&[0xa5, 0xbd], false), "好");
        assert_eq!(decoder.decode(&[], true), "");
    }
}
