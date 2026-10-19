---
id: network-http
title: HTTP 是应用层协议
subtitle: 状态行、头部与正文需要一致
minutes: 18
nativeRequired: true
type: lesson
chapterId: http
order: 0
---

## 长度按字节计算，教学子集不能冒充完整服务器。

HTTP/1.1 请求由请求行、头部、空行和可选正文组成，响应以状态行开始。行结束符使用 CRLF，头部与正文之间是连续两个 CRLF。Content-Length 表示正文的字节数，中文字符的数量不能直接用来填这个字段。TCP 只运输这些字节，并不会替应用检查 HTTP 状态码或解析分块传输。

示例自启动一次性回环服务，仅接收一个无正文 GET 请求，限制请求头最多四千零九十六字节，然后返回固定 UTF-8 正文和 Connection: close。客户端读到服务端关闭后结束，并同时限制总响应字节数。网络读写与 accept 都有超时边界，不会因缺少公网环境失败；服务线程最终被回收，动态端口也随资源释放归还。

这个实现没有覆盖分块编码、持久连接、压缩、重定向、请求正文、TLS 或通用头部语法，所以只作为协议边界练习。实际应用应选择成熟 HTTP 客户端或服务框架，避免用字符串切割实现完整 HTTP。后续依赖课会用 reqwest 读取同样的本机响应，并用 status 检查与超时配置表达应用层成功条件。学习目标是理解层次和失败位置，而不是声称手写了生产服务器。

<CourseCallout>

HTTP 传输成功与 2xx 状态不同；客户端要明确是否把 4xx、5xx 视为错误。

</CourseCallout>

## 亲手试一试

```rust playground id=network-http
use std::io::{self, Read, Write};
use std::net::{TcpListener, TcpStream};
use std::time::{Duration, Instant};

fn accept_until(listener: &TcpListener) -> io::Result<TcpStream> {
    // 用非阻塞轮询配合截止时间，避免示例一直等待连接。
    listener.set_nonblocking(true)?;

    // 设置等待截止时间，防止教学示例无限等待连接。
    let deadline = Instant::now() + Duration::from_secs(3);
    loop {
        // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
        match listener.accept() {
            Ok((stream, _)) => return Ok(stream),
            Err(error) if error.kind() == io::ErrorKind::WouldBlock => {
                if Instant::now() >= deadline {
                    return Err(io::Error::new(
                        io::ErrorKind::TimedOut,
                        "等待连接超时",
                    ));
                }
                std::thread::sleep(Duration::from_millis(2));
            }
            Err(error) => return Err(error),
        }
    }
}

fn limits(stream: &TcpStream) -> io::Result<()> {
    // 限制单次读取的等待时间，避免对方不发送数据时一直挂起。
    stream.set_read_timeout(Some(Duration::from_secs(3)))?;
    stream.set_write_timeout(Some(Duration::from_secs(3)))
}

fn main() -> io::Result<()> {
    // 只监听本机的动态端口，避免依赖固定端口或公网服务。
    let listener = TcpListener::bind("127.0.0.1:0")?;

    // 读取操作系统分配的地址，交给客户端建立本机连接。
    let address = listener.local_addr()?;

    // 保存任务句柄，不能把启动任务误当作任务已经完成。
    let job = std::thread::spawn(move || -> io::Result<()> {
        // 保存已建立的 TCP 字节流，读写时仍要处理分段与超时。
        let mut stream = accept_until(&listener)?;
        limits(&stream)?;

        // 保存协议头部，确认边界与长度后再解释正文。
        let mut header = Vec::new();
        while !header.ends_with(b"\r\n\r\n") {
            if header.len() >= 4096 {
                return Err(io::Error::other("请求头过大"));
            }

            // 每次读取一个字节来定位头部结束标记，不假定一次 read 取得完整请求。
            let mut byte = [0];

            // 读满协议要求的字节数；提前断开应作为错误处理。
            stream.read_exact(&mut byte)?;
            header.push(byte[0]);
        }

        // 保存当前请求或响应的正文，协议长度按字节计算。
        let body = "你好";
        write!(
            stream,
            "HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
            body.len()
        )?;

        // 持续写入直到全部字节发送完，避免忽略部分写入。
        stream.write_all(body.as_bytes())
    });

    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = (|| -> io::Result<()> {
        // 保存已建立的 TCP 字节流，读写时仍要处理分段与超时。
        let mut stream = TcpStream::connect_timeout(&address, Duration::from_secs(3))?;
        limits(&stream)?;
        write!(
            stream,
            "GET / HTTP/1.1\r\nHost: {address}\r\nConnection: close\r\n\r\n"
        )?;

        // 准备或读取响应，后续校验头部与正文是否符合协议。
        let mut response = String::new();
        stream.take(8192).read_to_string(&mut response)?;
        let (header, body) = response
            .split_once("\r\n\r\n")
            .ok_or_else(|| io::Error::other("无效响应"))?;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert!(header.contains("Content-Length: 6"));
        assert_eq!(body, "你好");
        Ok(())
    })();

    // 等待线程结束后再读取最终结果。
    job.join().map_err(|_| io::Error::other("线程失败"))??;
    result
}
```

<CourseCallout title="给自己一个小挑战">

把响应正文换成你好，确认 Content-Length 为 6；重复运行观察端口变化。

</CourseCallout>
