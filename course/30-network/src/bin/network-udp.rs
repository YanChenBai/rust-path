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
