use std::io::{self, Write};
use std::path::PathBuf;

fn main() -> io::Result<()> {
    // 把可能缺失的输入保存为 Option，后续必须安排缺失分支。
    let optional: Option<PathBuf> = std::env::args_os().nth(1).map(PathBuf::from);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("可选输入：{optional:?}");

    // 取得时间标记，配合进程号生成独立临时路径。
    let stamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(io::Error::other)?
        .as_nanos();

    // 创建本次演示独占的临时目录，避免不同运行互相覆盖。
    let dir =

        // 等待并发工作结束，再读取它产生的结果或处理线程恐慌。
        std::env::temp_dir().join(format!("rust-path-{}-{stamp}", std::process::id()));
    std::fs::create_dir(&dir)?;

    // 用 PathBuf 保存文件位置，避免手工拼接平台相关斜杠。
    let path = dir.join("记录.txt");
    {
        // 用缓冲写入器组织输出，完成后需要明确刷新。
        let mut writer = io::BufWriter::new(std::fs::File::create(&path)?);

        // 持续写入直到全部字节发送完，避免忽略部分写入。
        writer.write_all("你好\n".as_bytes())?;

        // 把缓冲数据明确写到底层，再继续读取或返回成功。
        writer.flush()?;
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(std::fs::read_to_string(&path)?, "你好\n");
    std::fs::remove_dir_all(&dir)?;
    Ok(())
}
