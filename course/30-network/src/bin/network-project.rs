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

fn local_http(body: &str) -> io::Result<String> {
    if body.len() > 1024 { return Err(io::Error::new(io::ErrorKind::InvalidInput, "正文过大")); }
    let listener = TcpListener::bind("127.0.0.1:0")?;
    let address = listener.local_addr()?;
    let body = body.to_owned();
    let server = std::thread::spawn(move || -> io::Result<()> {
        let mut stream = accept_until(&listener)?; limits(&stream)?;
        let mut request = Vec::new();
        while !request.ends_with(b"\r\n\r\n") {
            if request.len() >= 4096 { return Err(io::Error::new(io::ErrorKind::InvalidData, "请求头过大")); }
            let mut byte = [0]; stream.read_exact(&mut byte)?; request.push(byte[0]);
        }
        let header = format!("HTTP/1.1 200 OK\r\nContent-Length: {}\r\nConnection: close\r\n\r\n", body.len());
        stream.write_all(header.as_bytes())?; stream.write_all(body.as_bytes())
    });
    let response = (|| -> io::Result<String> {
        let mut stream = TcpStream::connect_timeout(&address, Duration::from_secs(3))?;
        limits(&stream)?;
        write!(stream, "GET / HTTP/1.1\r\nHost: {address}\r\nConnection: close\r\n\r\n")?;
        let mut output = String::new(); stream.take(8192).read_to_string(&mut output)?;
        Ok(output)
    })();
    let server_result = server.join().map_err(|_| io::Error::other("服务线程失败"))?;
    server_result?;
    response
}
// endregion:answer

fn main() {
// region:tests
for body in ["", "hello", "你好", "line\nnext"] {
    let response = local_http(body).unwrap();
    let (header, actual) = response.split_once("\r\n\r\n").unwrap();
    assert!(header.starts_with("HTTP/1.1 200 OK\r\n"));
    assert!(header.lines().any(|line| line == format!("Content-Length: {}", body.len())));
    assert_eq!(actual, body);
}
assert!(local_http(&"x".repeat(1025)).is_err());
// endregion:tests
    println!("__PASS__");
}
