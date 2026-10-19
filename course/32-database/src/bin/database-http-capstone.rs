use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
type Error = Box<dyn std::error::Error + Send + Sync>;

fn serve(listener: TcpListener, path: std::path::PathBuf) -> Result<(), Error> {
    listener.set_nonblocking(true)?;

    // 设置等待截止时间，防止教学示例无限等待连接。
    let deadline = Instant::now() + Duration::from_secs(3);

    // 保存已建立的 TCP 字节流，读写时仍要处理分段与超时。
    let mut stream = loop {
        // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
        match listener.accept() {
            Ok((stream, _)) => break stream,
            Err(error) if error.kind() == std::io::ErrorKind::WouldBlock => {
                if Instant::now() >= deadline {
                    return Err("等待连接超时".into());
                }
                std::thread::sleep(Duration::from_millis(5));
            }
            Err(error) => return Err(error.into()),
        }
    };

    // 限制单次读取的等待时间，避免对方不发送数据时一直挂起。
    stream.set_read_timeout(Some(Duration::from_secs(3)))?;
    stream.set_write_timeout(Some(Duration::from_secs(3)))?;

    // 收集请求头部字节，并通过上限检查控制内存使用。
    let mut request = Vec::new();

    // 记录头部结束的位置，使头部与正文解析彼此分开。
    let header_end = loop {
        if let Some(index) = request.windows(4).position(|part| part == b"\r\n\r\n") {
            break index + 4;
        }
        if request.len() >= 4096 {
            return Err("请求头过长".into());
        }

        // 每次读取一个字节来定位头部结束标记，不假定一次 read 取得完整请求。
        let mut byte = [0];

        // 读满协议要求的字节数；提前断开应作为错误处理。
        stream.read_exact(&mut byte)?;
        request.push(byte[0]);
    };

    // 保存协议头部，确认边界与长度后再解释正文。
    let header = std::str::from_utf8(&request[..header_end])?;

    // 解析正文声明的字节数，读取前先检查大小上限。
    let length: usize = header
        .lines()
        .find_map(|line| {
            let (key, value) = line.split_once(':')?;
            if key.eq_ignore_ascii_case("content-length") {
                value.trim().parse().ok()
            } else {
                None
            }
        })
        .ok_or("缺少长度")?;
    if length > 1024 {
        return Err("请求体过长".into());
    }

    // 判断请求是否匹配本示例支持的方法和路径。
    let is_route = header.starts_with("POST /minutes HTTP/1.1\r\n");

    // 保存当前请求或响应的正文，协议长度按字节计算。
    let mut body = vec![0; length];
    stream.read_exact(&mut body)?;

    // 保存待处理的原始输入，清理、解析与筛选都从它开始。
    let input: serde_json::Value = serde_json::from_slice(&body)?;

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = input.get("minutes").and_then(|n| n.as_i64());

    // 打开 SQLite 连接，通过 SQL 和绑定参数访问数据。
    let mut db = rusqlite::Connection::open(path)?;
    let (status, text) = match minutes {
        Some(n) if is_route && (1..=180).contains(&n) => {
            // 提交成功之后才向客户端确认保存成功。
            let tx = db.transaction()?;
            tx.execute("INSERT INTO logs(minutes) VALUES (?1)", [n])?;

            // 所有相关写入都成功后才提交，防止留下半批数据。
            tx.commit()?;
            ("201 Created", "saved")
        }
        _ => ("400 Bad Request", "invalid"),
    };
    write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{text}",
        text.len()
    )?;
    Ok(())
}

fn main() -> Result<(), Error> {
    // 取得时间标记，配合进程号生成独立临时路径。
    let stamp = SystemTime::now().duration_since(UNIX_EPOCH)?.as_nanos();

    // 为本轮演示准备独占目录，结束时统一清理。
    let directory = std::env::temp_dir()
        // 等待并发工作结束，再读取它产生的结果或处理线程恐慌。
        .join(format!("rust-path-db-{}-{stamp}", std::process::id()));
    std::fs::create_dir(&directory)?;

    // 用 PathBuf 保存文件位置，避免手工拼接平台相关斜杠。
    let path = directory.join("study.sqlite");

    // 保存整段业务的执行结果，让清理操作在返回前仍能执行。
    let outcome = (|| -> Result<(), Error> {
        // 打开 SQLite 连接，通过 SQL 和绑定参数访问数据。
        let db = rusqlite::Connection::open(&path)?;
        db.execute_batch("CREATE TABLE logs(minutes INTEGER NOT NULL CHECK(minutes BETWEEN 1 AND 180));")?;

        // 主动释放这个值或守卫，观察资源存活与访问范围的变化。
        drop(db);

        // 只监听本机的动态端口，避免依赖固定端口或公网服务。
        let listener = TcpListener::bind("127.0.0.1:0")?;

        // 读取操作系统分配的地址，交给客户端建立本机连接。
        let address = listener.local_addr()?;

        // 复制路径值交给服务线程，不共享主线程的临时借用。
        let server_path = path.clone();

        // 保存工作线程或任务的句柄，稍后需要等待并检查完成结果。
        let worker = std::thread::spawn(move || serve(listener, server_path));

        // 保存客户端操作的入口或结果，与服务端完成状态分别检查。
        let client = (|| -> Result<String, Error> {
            // 保存已建立的 TCP 字节流，读写时仍要处理分段与超时。
            let mut stream =
                TcpStream::connect_timeout(&address, Duration::from_secs(3))?;
            stream.set_read_timeout(Some(Duration::from_secs(3)))?;
            stream.set_write_timeout(Some(Duration::from_secs(3)))?;

            // 保存当前请求或响应的正文，协议长度按字节计算。
            let body = r#"{"minutes":25}"#;
            write!(
                stream,
                "POST /minutes HTTP/1.1\r\nHost: localhost\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
                body.len()
            )?;

            // 准备或读取响应，后续校验头部与正文是否符合协议。
            let mut response = String::new();
            stream.take(4096).read_to_string(&mut response)?;
            Ok(response)
        })();

        // 保存服务端的运行入口或完成结果，稍后统一检查。
        let server = worker.join().map_err(|_| "服务线程失败")?;
        server?;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert!(client?.starts_with("HTTP/1.1 201 Created\r\n"));
        // 关闭原连接后重新打开文件，验证数据确实已经写入。
        let reopened = rusqlite::Connection::open(&path)?;

        // 累计本次处理结果，后续断言会检查最终数值。
        let total: i64 =
            reopened
                .query_row("SELECT SUM(minutes) FROM logs", [], |row| row.get(0))?;
        assert_eq!(total, 25);

        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("HTTP 201，重新打开数据库后总时长：{total}");
        Ok(())
    })();
    std::fs::remove_dir_all(&directory)?;
    outcome
}
