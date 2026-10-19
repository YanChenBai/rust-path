use rusqlite::{Connection, params};

fn main() -> rusqlite::Result<()> {
    // 打开 SQLite 连接，通过 SQL 和绑定参数访问数据。
    let db = Connection::open_in_memory()?;
    db.execute_batch("CREATE TABLE logs(name TEXT NOT NULL, minutes INTEGER NOT NULL CHECK(minutes > 0));")?;
    // 用户输入作为参数，不拼接进 SQL。
    db.execute(
        "INSERT INTO logs(name,minutes) VALUES (?1,?2)",
        params!["Ada's Rust", 25],
    )?;

    // 累计本次处理结果，后续断言会检查最终数值。
    let total: i64 =
        db.query_row("SELECT COALESCE(SUM(minutes),0) FROM logs", [], |row| {
            row.get(0)
        })?;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(total, 25);
    Ok(())
}
