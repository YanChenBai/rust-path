---
id: ecosystem-reqwest
title: reqwest 与本机 JSON 服务
subtitle: 配置超时、状态检查和解析边界
minutes: 18
nativeRequired: true
dependencies:
  - tokio
  - serde
  - serde_json
  - anyhow
  - reqwest
type: lesson
chapterId: http
order: 1
---

## HTTP 客户端处理传输细节，应用仍需定义成功条件。

reqwest 的异步 Client 可以复用连接池，并把请求发送、状态处理和正文解析分为独立步骤。send 成功只代表收到了响应，不保证状态是成功，error_for_status 可以把四百和五百段状态转换成错误。json::&lt;T&gt;() 继续解析正文，解析成功之后仍可能需要领域校验。示例复用同一个 Client，并显式配置连接超时和请求总超时。

本机服务用 Tokio 的 TcpListener 绑定回环动态端口，不请求公网，也不依赖用户提前启动其他程序。服务端用 timeout 包住 accept 和整次读写，限制请求头长度，并返回带 Content-Length 的 JSON。客户端显式禁用代理，避免机器上的代理配置把回环请求转发出去；服务端与客户端分别有时间上界，即使错误路径也会等待服务任务结束。

运行器提供 reqwest 0.12，启用 json 与 rustls-tls、关闭默认功能；这里使用异步接口，不要求未启用的 blocking 功能。Tokio 提供运行时，serde 派生目标结构，serde_json 生成服务端正文。真实应用还要考虑重试是否幂等、正文大小限制与认证，本课的固定小响应只验证本机交换。不要把完整 HTTP 客户端与手写的一次性教学服务混为同等成熟度。

<CourseCallout>

参考文档：https://docs.rs/reqwest/0.12/reqwest/`struct`.ClientBuilder.html；本例不使用 blocking feature。

</CourseCallout>

## 亲手试一试

```rust playground id=ecosystem-reqwest
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
                    let mut byte = [0]; stream.read_exact(&mut byte).await?;
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
```

<CourseCallout title="给自己一个小挑战">

把状态改成 500，观察 error_for_status；恢复后用字段类型不匹配验证 JSON 错误。

</CourseCallout>
