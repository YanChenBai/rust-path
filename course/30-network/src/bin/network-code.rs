// region:answer

use std::io::{self, Read, Write};
use std::net::{TcpListener, TcpStream};
use std::time::{Duration, Instant};

fn accept_until(listener: &TcpListener) -> io::Result<TcpStream> {
    listener.set_nonblocking(true)?;
    let deadline = Instant::now() + Duration::from_secs(3);
    loop {
        match listener.accept() {
            Ok((stream, _)) => return Ok(stream),
            Err(e) if e.kind() == io::ErrorKind::WouldBlock => {
                if Instant::now() >= deadline {
                    return Err(io::Error::new(io::ErrorKind::TimedOut, "等待连接超时"));
                }
                std::thread::sleep(Duration::from_millis(2));
            }
            Err(e) => return Err(e),
        }
    }
}

fn limits(stream: &TcpStream) -> io::Result<()> {
    stream.set_read_timeout(Some(Duration::from_secs(3)))?;
    stream.set_write_timeout(Some(Duration::from_secs(3)))
}

fn tcp_echo(payload: &[u8]) -> io::Result<Vec<u8>> {
    if payload.len() > 1024 {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "最多 1024 字节",
        ));
    }
    let listener = TcpListener::bind("127.0.0.1:0")?;
    let address = listener.local_addr()?;
    let server = std::thread::spawn(move || -> io::Result<()> {
        let mut stream = accept_until(&listener)?;
        limits(&stream)?;
        let mut header = [0u8; 2];
        stream.read_exact(&mut header)?;
        let length = u16::from_be_bytes(header) as usize;
        if length > 1024 {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "帧过大"));
        }
        let mut body = vec![0; length];
        stream.read_exact(&mut body)?;
        stream.write_all(&header)?;
        stream.write_all(&body)
    });
    let response = (|| -> io::Result<Vec<u8>> {
        let mut stream = TcpStream::connect_timeout(&address, Duration::from_secs(3))?;
        limits(&stream)?;
        stream.write_all(&(payload.len() as u16).to_be_bytes())?;
        stream.write_all(payload)?;
        let mut header = [0; 2];
        stream.read_exact(&mut header)?;
        let length = u16::from_be_bytes(header) as usize;
        if length > 1024 {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "帧过大"));
        }
        let mut output = vec![0; length];
        stream.read_exact(&mut output)?;
        Ok(output)
    })();
    let server_result = server
        .join()
        .map_err(|_| io::Error::other("服务线程失败"))?;
    server_result?;
    response
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(tcp_echo(b"").unwrap(), b"");
    assert_eq!(tcp_echo("你好".as_bytes()).unwrap(), "你好".as_bytes());
    assert_eq!(tcp_echo(&vec![7; 1024]).unwrap(), vec![7; 1024]);
    assert!(tcp_echo(&vec![0; 1025]).is_err());
    for _ in 0..3 {
        assert_eq!(tcp_echo(b"repeat").unwrap(), b"repeat");
    }
    // endregion:tests
    println!("__PASS__");
}
