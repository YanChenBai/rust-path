use rusqlite::Connection;

fn main() -> rusqlite::Result<()> {
    // 打开 SQLite 连接，通过 SQL 和绑定参数访问数据。
    let mut db = Connection::open_in_memory()?;
    db.execute_batch("CREATE TABLE logs(minutes INTEGER CHECK(minutes > 0));")?;
    {
        // 开始一组原子更新，全部成功后才提交，失败时回滚。
        let tx = db.transaction()?;
        tx.execute("INSERT INTO logs VALUES (?1)", [25])?;
        // 刻意不 commit，离开作用域回滚。
    }

    // 保存当前计数，用于对比操作之前与之后的状态。
    let count: i64 = db.query_row("SELECT COUNT(*) FROM logs", [], |row| row.get(0))?;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(count, 0);
    Ok(())
}
