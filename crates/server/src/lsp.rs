use crate::{
    process,
    project::{Project, validate_code},
};
use anyhow::{Context, Result, anyhow, bail};
use serde_json::{Value, json};
use std::{
    collections::HashMap,
    sync::{
        Arc, Weak,
        atomic::{AtomicBool, AtomicU64, Ordering},
    },
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use tokio::{
    io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader},
    process::{ChildStdin, ChildStdout},
    sync::{Mutex, oneshot},
    task::JoinHandle,
};
use tokio_util::sync::CancellationToken;
use url::Url;

type Reply = oneshot::Sender<std::result::Result<Value, String>>;

struct Document {
    code: String,
    version: u64,
    diagnostics: Vec<Value>,
    compiler: Vec<Value>,
}

pub struct Session {
    project: Project,
    uri: String,
    child: Mutex<process::Process>,
    writer: Mutex<ChildStdin>,
    pending: Mutex<HashMap<u64, Reply>>,
    document: Mutex<Document>,
    status: Mutex<Value>,
    progress: Mutex<HashMap<String, Value>>,
    sequence: AtomicU64,
    closed: AtomicBool,
    pub touched: AtomicU64,
    cancel: CancellationToken,
    reader: Mutex<Option<JoinHandle<()>>>,
    checker: Mutex<Option<JoinHandle<()>>>,
}

pub fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

impl Session {
    pub async fn open(
        code: String,
        dependencies: &[String],
        shutdown: &CancellationToken,
    ) -> Result<Arc<Self>> {
        let project = Project::create(&code, dependencies).await?;
        let uri = Url::from_file_path(project.source())
            .map_err(|_| anyhow!("无效的源码路径"))?
            .to_string();
        let root =
            Url::from_directory_path(project.path()).map_err(|_| anyhow!("无效的项目路径"))?;
        let mut cmd = process::command("rust-analyzer");
        cmd.current_dir(project.path())
            .stdin(std::process::Stdio::piped())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::null())
            .env(
                "CARGO_TARGET_DIR",
                std::env::temp_dir().join("rust-path-cargo-target"),
            );
        let mut child = process::spawn(&mut cmd)?;
        let writer = child
            .0
            .inner()
            .stdin
            .take()
            .context("无法打开语言服务输入")?;
        let output = child
            .0
            .inner()
            .stdout
            .take()
            .context("无法打开语言服务输出")?;
        let session = Arc::new(Self {
            project,
            uri,
            child: Mutex::new(child),
            writer: Mutex::new(writer),
            pending: Mutex::new(HashMap::new()),
            document: Mutex::new(Document {
                code: code.clone(),
                version: 1,
                diagnostics: Vec::new(),
                compiler: Vec::new(),
            }),
            sequence: AtomicU64::new(1),
            status: Mutex::new(json!({"health":"ok","quiescent":false})),
            progress: Mutex::new(HashMap::new()),
            closed: AtomicBool::new(false),
            touched: AtomicU64::new(now()),
            cancel: shutdown.child_token(),
            reader: Mutex::new(None),
            checker: Mutex::new(None),
        });
        *session.reader.lock().await = Some(tokio::spawn(read_messages(
            Arc::downgrade(&session),
            output,
        )));
        let result = async {
            session.request("initialize", json!({
                "processId":std::process::id(), "rootUri":root.as_str(),
                "capabilities":{
                    "window":{"workDoneProgress":true},
                    "experimental":{"serverStatusNotification":true},
                    "general":{"positionEncodings":["utf-16"]},
                    "textDocument":{
                        "completion":{"completionItem":{"snippetSupport":true}},
                        "hover":{"contentFormat":["markdown","plaintext"]},
                        "publishDiagnostics":{"versionSupport":true}
                    }
                },
                "initializationOptions":{"checkOnSave":false,"cargo":{"buildScripts":{"enable":true}},"procMacro":{"enable":true}}
            })).await?;
            session.notify("initialized", json!({})).await?;
            session.notify("textDocument/didOpen", json!({"textDocument":{"uri":session.uri,"languageId":"rust","version":1,"text":code}})).await?;
            session.schedule_check().await;
            Ok::<_, anyhow::Error>(())
        }.await;
        if let Err(error) = result {
            session.close().await;
            return Err(error);
        }
        Ok(session)
    }

    async fn send(&self, mut message: Value) -> Result<()> {
        if self.closed.load(Ordering::Acquire) || self.cancel.is_cancelled() {
            bail!("语言服务会话已关闭");
        }
        message["jsonrpc"] = json!("2.0");
        let bytes = serde_json::to_vec(&message)?;
        let mut writer = self.writer.lock().await;
        writer
            .write_all(format!("Content-Length: {}\r\n\r\n", bytes.len()).as_bytes())
            .await?;
        writer.write_all(&bytes).await?;
        writer.flush().await?;
        Ok(())
    }

    async fn notify(&self, method: &str, params: Value) -> Result<()> {
        self.send(json!({"method":method,"params":params})).await
    }

    async fn request(&self, method: &str, params: Value) -> Result<Value> {
        let id = self.sequence.fetch_add(1, Ordering::Relaxed);
        let (tx, rx) = oneshot::channel();
        self.pending.lock().await.insert(id, tx);
        if let Err(error) = self
            .send(json!({"id":id,"method":method,"params":params}))
            .await
        {
            self.pending.lock().await.remove(&id);
            return Err(error);
        }
        let result = tokio::select! {
            reply = tokio::time::timeout(Duration::from_secs(30), rx) => match reply {
                Ok(Ok(Ok(value))) => Ok(value),
                Ok(Ok(Err(error))) => Err(anyhow!(error)),
                Ok(Err(_)) => Err(anyhow!("语言服务连接已中断")),
                Err(_) => Err(anyhow!("rust-analyzer 响应超时")),
            },
            _ = self.cancel.cancelled() => Err(anyhow!("语言服务会话已关闭")),
        };
        self.pending.lock().await.remove(&id);
        result
    }

    pub async fn language_request(&self, method: &str, position: Value) -> Result<Value> {
        self.request(
            method,
            json!({"textDocument":{"uri":self.uri},"position":position}),
        )
        .await
    }

    pub async fn change(self: &Arc<Self>, code: String) -> Result<()> {
        validate_code(&code)?;
        {
            let mut document = self.document.lock().await;
            if code == document.code {
                return Ok(());
            }
            let version = document.version + 1;
            self.notify("textDocument/didChange", json!({"textDocument":{"uri":self.uri,"version":version},"contentChanges":[{"text":code}]})).await?;
            tokio::fs::write(self.project.source(), &code).await?;
            self.notify(
                "textDocument/didSave",
                json!({"textDocument":{"uri":self.uri}}),
            )
            .await?;
            document.code = code;
            document.version = version;
            document.diagnostics.clear();
            document.compiler.clear();
        }
        self.schedule_check().await;
        Ok(())
    }

    async fn schedule_check(self: &Arc<Self>) {
        let mut checker = self.checker.lock().await;
        if let Some(task) = checker.take() {
            task.abort();
            let _ = task.await;
        }
        let session = self.clone();
        *checker = Some(tokio::spawn(async move {
            tokio::select! {
                _ = tokio::time::sleep(Duration::from_millis(500)) => {},
                _ = session.cancel.cancelled() => return,
            }
            let (version, code) = {
                let document = session.document.lock().await;
                (document.version, document.code.clone())
            };
            let result = process::execute(
                session.project.path(),
                &["check", "--message-format=json", "--color=never"],
                session.cancel.child_token(),
                None,
                16 * 1024 * 1024,
            )
            .await;
            let mut diagnostics = Vec::new();
            match result {
                Ok(result) => {
                    diagnostics = compiler_diagnostics(&result.stdout, &code);
                    if result.output_exceeded || (!result.success && diagnostics.is_empty()) {
                        diagnostics.push(check_failure(&result.stderr));
                    }
                }
                Err(error) => diagnostics.push(check_failure(&error.to_string())),
            }
            let mut document = session.document.lock().await;
            if version == document.version && !session.cancel.is_cancelled() {
                document.compiler = diagnostics;
            }
        }));
    }

    pub async fn diagnostics(&self) -> Value {
        let document = self.document.lock().await;
        let diagnostics: Vec<_> = document
            .diagnostics
            .iter()
            .chain(&document.compiler)
            .cloned()
            .collect();
        json!({"diagnostics":diagnostics,"version":document.version})
    }

    pub async fn status(&self) -> Value {
        let mut status = self.status.lock().await.clone();
        let progress = self.progress.lock().await;
        status["tasks"] = json!(progress.values().collect::<Vec<_>>());
        status["ready"] = json!(status["quiescent"] == true && progress.is_empty());
        status
    }

    pub async fn close(&self) {
        if self.closed.swap(true, Ordering::AcqRel) {
            return;
        }
        self.cancel.cancel();
        if let Some(task) = self.checker.lock().await.take() {
            task.abort();
            let _ = task.await;
        }
        let mut child = self.child.lock().await;
        let _ = child.0.start_kill();
        let _ = tokio::time::timeout(Duration::from_secs(5), async {
            while let Ok(None) = child.0.try_wait() {
                tokio::time::sleep(Duration::from_millis(20)).await;
            }
        })
        .await;
        if let Some(task) = self.reader.lock().await.take() {
            task.abort();
            let _ = task.await;
        }
        self.pending.lock().await.clear();
    }
}

async fn read_messages(session: Weak<Session>, output: ChildStdout) {
    let mut reader = BufReader::new(output);
    loop {
        let result = read_message(&mut reader).await;
        let Some(session) = session.upgrade() else {
            return;
        };
        let message = match result {
            Ok(message) => message,
            Err(error) => {
                *session.status.lock().await =
                    json!({"health":"error","quiescent":true,"message":error.to_string()});
                for (_, sender) in session.pending.lock().await.drain() {
                    let _ = sender.send(Err(error.to_string()));
                }
                return;
            }
        };
        if let Some(method) = message["method"].as_str() {
            if method == "experimental/serverStatus" {
                *session.status.lock().await = message["params"].clone();
            }
            if method == "$/progress" {
                let token = message["params"]["token"].to_string();
                let value = &message["params"]["value"];
                let mut progress = session.progress.lock().await;
                match value["kind"].as_str() {
                    Some("begin") => {
                        progress.insert(token, value.clone());
                    }
                    Some("report") => {
                        if let Some(task) = progress.get_mut(&token) {
                            for (key, value) in value.as_object().into_iter().flatten() {
                                task[key] = value.clone();
                            }
                        }
                    }
                    Some("end") => {
                        progress.remove(&token);
                    }
                    _ => {}
                }
            }
            if method == "textDocument/publishDiagnostics"
                && message["params"]["uri"]
                    .as_str()
                    .is_some_and(|uri| uri.eq_ignore_ascii_case(&session.uri))
            {
                let mut document = session.document.lock().await;
                if message["params"]["version"]
                    .as_u64()
                    .is_none_or(|version| version == document.version)
                {
                    document.diagnostics = message["params"]["diagnostics"]
                        .as_array()
                        .cloned()
                        .unwrap_or_default();
                }
            }
            if !message["id"].is_null() {
                let result = if method == "workspace/configuration" {
                    json!(
                        message["params"]["items"]
                            .as_array()
                            .map(|items| vec![Value::Null; items.len()])
                            .unwrap_or_default()
                    )
                } else {
                    Value::Null
                };
                let _ = session
                    .send(json!({"id":message["id"],"result":result}))
                    .await;
            }
        } else if let Some(id) = message["id"].as_u64()
            && let Some(sender) = session.pending.lock().await.remove(&id)
        {
            let result = if message["error"].is_object() {
                Err(message["error"]["message"]
                    .as_str()
                    .unwrap_or("语言服务请求失败")
                    .to_owned())
            } else {
                Ok(message["result"].clone())
            };
            let _ = sender.send(result);
        }
    }
}

async fn read_message(reader: &mut (impl tokio::io::AsyncBufRead + Unpin)) -> Result<Value> {
    let mut length = None;
    let mut size = 0;
    loop {
        let mut line = String::new();
        if reader.read_line(&mut line).await? == 0 {
            bail!("rust-analyzer 输出已关闭");
        }
        size += line.len();
        if size > 8192 {
            bail!("LSP 消息头过大");
        }
        if line == "\r\n" || line == "\n" {
            break;
        }
        if let Some((name, value)) = line.split_once(':')
            && name.eq_ignore_ascii_case("Content-Length")
        {
            length = Some(value.trim().parse::<usize>()?);
        }
    }
    let length = length.context("LSP 消息缺少 Content-Length")?;
    if length == 0 || length > 16 * 1024 * 1024 {
        bail!("LSP 消息大小无效");
    }
    let mut body = vec![0; length];
    reader.read_exact(&mut body).await?;
    Ok(serde_json::from_slice(&body)?)
}

fn check_failure(message: &str) -> Value {
    json!({"message":message,"severity":2,"source":"cargo","range":{"start":{"line":0,"character":0},"end":{"line":0,"character":1}}})
}

fn compiler_diagnostics(output: &str, code: &str) -> Vec<Value> {
    let mut diagnostics = Vec::new();
    for line in output.lines() {
        let Ok(item) = serde_json::from_str::<Value>(line) else {
            continue;
        };
        if item["reason"] != "compiler-message" {
            continue;
        }
        let message = &item["message"];
        let Some(spans) = message["spans"].as_array() else {
            continue;
        };
        for span in spans {
            if span["is_primary"] != true
                || !span["file_name"]
                    .as_str()
                    .is_some_and(|name| name.replace('\\', "/").ends_with("main.rs"))
            {
                continue;
            }
            let position = |line: &str, column: &str| {
                let row = span[line].as_u64().unwrap_or(1).saturating_sub(1) as usize;
                let column = span[column].as_u64().unwrap_or(1).saturating_sub(1) as usize;
                let character: usize = code
                    .lines()
                    .nth(row)
                    .unwrap_or("")
                    .chars()
                    .take(column)
                    .map(char::len_utf16)
                    .sum();
                json!({"line":row,"character":character})
            };
            diagnostics.push(json!({"message":message["message"],"code":message["code"]["code"],"severity":if message["level"] == "error" {1} else {2},"source":"rustc","range":{"start":position("line_start","column_start"),"end":position("line_end","column_end")}}));
        }
    }
    diagnostics
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn parse_consecutive_utf8_frames_and_reject_bad_lengths() {
        let message = json!({"result":"你好"}).to_string();
        let frame = format!("Content-Length: {}\r\n\r\n{message}", message.len());
        let input = frame.repeat(2);
        let mut reader = BufReader::new(input.as_bytes());
        assert_eq!(read_message(&mut reader).await.unwrap()["result"], "你好");
        assert_eq!(read_message(&mut reader).await.unwrap()["result"], "你好");
        assert!(
            read_message(&mut BufReader::new(
                &b"Content-Length: 999999999\r\n\r\n"[..]
            ))
            .await
            .is_err()
        );
    }
}
