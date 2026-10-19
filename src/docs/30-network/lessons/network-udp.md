---
id: network-udp
title: UDP 数据报与来源地址
subtitle: 保留消息边界，但不保证到达
minutes: 18
nativeRequired: true
type: lesson
chapterId: network
order: 1
---

## 数据报的成功发送不等于对方成功处理。

UDP 以数据报为单位通信，recv_from 同时返回收到的长度与来源地址，服务端可把响应发送回这个地址。它不保证送达、顺序或去重，应用如果需要可靠性，就要设计序号、确认与重试。不能因为回环测试稳定成功，就推断真实网络永远不会丢包；测试证明的是本机协议代码的基本行为。

接收缓冲区过小可能导致截断或平台相关错误，不能把缓冲区长度自动当成完整消息长度。教学示例限定四字节消息并提供足够缓冲区，只比较返回长度以内的内容，避免把后面的零字节当作消息的一部分。接收来源也属于协议输入，本机客户端要校验响应来自刚绑定的服务端地址，而不是接受任意数据报。

示例的服务端和客户端都绑定动态回环端口，并对两端设置读写超时；即使工作线程未收到数据，recv_from 也会在错误路径退出。主线程保存交换结果后再 join 服务线程，确保重复运行时资源已回收。UDP 没有 TCP 那样的连接握手，connect 的意义主要是选择默认对端与过滤来源，不代表已经证明远端应用存在，更不等于建立可靠会话。

<CourseCallout>

不要用大于实际收到长度的切片解析响应；生产协议需要明确最大数据报大小。

</CourseCallout>

## 亲手试一试

```rust playground id=network-udp
use std::io;
use std::net::UdpSocket;
use std::time::Duration;

fn configure(socket: &UdpSocket) -> io::Result<()> {
    // 限制单次读取的等待时间，避免对方不发送数据时一直挂起。
    socket.set_read_timeout(Some(Duration::from_secs(3)))?;
    socket.set_write_timeout(Some(Duration::from_secs(3)))
}

fn main() -> io::Result<()> {
    // 保存服务端的运行入口或完成结果，稍后统一检查。
    let server = UdpSocket::bind("127.0.0.1:0")?;
    configure(&server)?;

    // 读取操作系统分配的地址，交给客户端建立本机连接。
    let address = server.local_addr()?;

    // 保存任务句柄，不能把启动任务误当作任务已经完成。
    let job = std::thread::spawn(move || -> io::Result<()> {
        // 准备有限大小的接收缓冲，只处理实际收到的字节。
        let mut buffer = [0; 64];
        let (length, peer) = server.recv_from(&mut buffer)?;

        // 记录实际发送的字节数，不能把它等同于对端已处理成功。
        let sent = server.send_to(&buffer[..length], peer)?;
        if sent != length {
            return Err(io::Error::other("数据报发送不完整"));
        }
        Ok(())
    });

    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = (|| -> io::Result<()> {
        // 保存客户端操作的入口或结果，与服务端完成状态分别检查。
        let client = UdpSocket::bind("127.0.0.1:0")?;
        configure(&client)?;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(client.send_to(b"ping", address)?, 4);

        // 准备有限大小的接收缓冲，只处理实际收到的字节。
        let mut buffer = [0; 64];
        let (length, peer) = client.recv_from(&mut buffer)?;
        assert_eq!(peer, address);
        assert_eq!(&buffer[..length], b"ping");
        Ok(())
    })();

    // 等待线程结束后再读取最终结果。
    job.join().map_err(|_| io::Error::other("线程失败"))??;
    result
}
```

<CourseCallout title="给自己一个小挑战">

把四字节内容替换成中文，确认比较的是字节；增加来源地址断言。

</CourseCallout>
