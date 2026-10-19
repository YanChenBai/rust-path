---
id: network-tcp
title: TCP 字节流与消息边界
subtitle: 成功读取不代表收到整条消息
minutes: 18
nativeRequired: true
type: lesson
chapterId: network
order: 0
---

## 先定义帧格式，再处理分片与错误。

TCP 提供可靠、有序的字节流，不保留应用 write 的调用边界。一次 read 可能只拿到部分内容，也可能一次读到多条消息的一部分；协议必须自己定义定长、分隔符或长度前缀。read_exact 适合已知长度的数据，但对方提前关闭时会返回错误，不能把未填满的缓冲区当成合法消息继续处理。

示例在 127.0.0.1 的端口零绑定监听器，让操作系统分配空闲端口，再用 local_addr 传给客户端。这样可以重复运行，也避免占用固定端口或依赖公网服务。这里发送四字节固定消息，服务端读取恰好四字节再回写；编程题进一步使用两字节大端长度前缀，并限制最大消息长度，避免由不可信长度直接分配无限内存。

连接、读取、写入与等待连接分别需要考虑超时。TcpListener 没有同样的读取超时接口，所以辅助函数用非阻塞 accept 加截止时间；每条已连接流设置读写超时，客户端使用 connect_timeout。最后无论客户端业务成功与否，都等待服务线程返回，避免遗留后台工作。这是本机有限教学交换，不把单次系统调用超时误当作完整协议的绝对总截止时间。

<CourseCallout>

真实服务还需要限制并发、总字节数与整体请求期限；TCP 本身不提供业务认证。

</CourseCallout>

## 亲手试一试

```rust playground id=network-tcp
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

    // 保存服务端的运行入口或完成结果，稍后统一检查。
    let server = std::thread::spawn(move || -> io::Result<()> {
        // 保存已建立的 TCP 字节流，读写时仍要处理分段与超时。
        let mut stream = accept_until(&listener)?;
        limits(&stream)?;

        // 保存本次消息内容或分支选出的提示。
        let mut message = [0; 4];

        // 读满协议要求的字节数；提前断开应作为错误处理。
        stream.read_exact(&mut message)?;

        // 持续写入直到全部字节发送完，避免忽略部分写入。
        stream.write_all(&message)
    });

    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = (|| -> io::Result<()> {
        // 保存客户端操作的入口或结果，与服务端完成状态分别检查。
        let mut client = TcpStream::connect_timeout(&address, Duration::from_secs(3))?;
        limits(&client)?;
        client.write_all(b"rust")?;

        // 准备或读取响应，后续校验头部与正文是否符合协议。
        let mut response = [0; 4];
        client.read_exact(&mut response)?;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(&response, b"rust");
        Ok(())
    })();

    // 等待线程结束后再读取最终结果。
    server.join().map_err(|_| io::Error::other("线程失败"))??;
    result
}
```

<CourseCallout title="给自己一个小挑战">

把 payload 改成 UTF-8 字节，增加长度前缀；对超长输入先返回 InvalidInput。

</CourseCallout>
