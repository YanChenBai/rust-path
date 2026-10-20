use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

#[derive(serde::Deserialize)]

struct Health {
    ok: bool,
}

fn main() -> anyhow::Result<()> {
    // 创建驱动 Future 的异步运行时；声明 async 本身不会启动它。
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()?;
    runtime.block_on(async {

        // 等待任务就绪时让出执行机会，不等同于阻塞当前线程。
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await?;

        // 读取操作系统分配的地址，交给客户端建立本机连接。
        let address = listener.local_addr()?;

        // 保存服务端的运行入口或完成结果，稍后统一检查。
        let server = tokio::spawn(async move {
            tokio::time::timeout(Duration::from_secs(3), async move {
                // 等待异步步骤完成；等待期间允许运行时调度其他就绪任务。
                let (mut stream, _) = listener.accept().await?;

                // 保存协议头部，确认边界与长度后再解释正文。
                let mut header = Vec::new();
                while !header.ends_with(b"\r\n\r\n") {
                    anyhow::ensure!(header.len() < 4096, "请求头过大");

                    // 每次读取一个字节来定位头部结束标记，不假定一次 read 取得完整请求。
                    let mut byte = [0];
                    stream.read_exact(&mut byte).await?;
                    header.push(byte[0]);
                }

                // 保存当前请求或响应的正文，协议长度按字节计算。
                let body = serde_json::to_vec(&serde_json::json!({"ok": true}))?;

                // 保存协议头部，确认边界与长度后再解释正文。
                let header = format!("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n", body.len());

                // 持续写入直到全部字节发送完，避免忽略部分写入。
                stream.write_all(header.as_bytes()).await?;
                stream.write_all(&body).await?;
                stream.shutdown().await?;
                Ok::<_, anyhow::Error>(())
            }).await?
        });

        // 准备或读取响应，后续校验头部与正文是否符合协议。
        let response = async {
            // 保存客户端操作的入口或结果，与服务端完成状态分别检查。
            let client = reqwest::Client::builder().no_proxy()
                .connect_timeout(Duration::from_secs(2)).timeout(Duration::from_secs(3)).build()?;

            // 保存当前步骤得到的值，后续通过接口检查或转换。
            let value = client.get(format!("http://{address}/health")).send().await?
                .error_for_status()?.json::<Health>().await?;
            anyhow::ensure!(value.ok, "服务未就绪");
            Ok::<_, anyhow::Error>(())
        }.await;
        server.await??;
        response
    })
}
