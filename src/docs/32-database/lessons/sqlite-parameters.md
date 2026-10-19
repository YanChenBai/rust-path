---
id: sqlite-parameters
title: 参数绑定与结构化查询
subtitle: SQL 与参数分开发送，避免把用户输入拼成语句。
minutes: 16
type: lesson
chapterId: database
order: 0
---

## SQL 与参数分开发送，避免把用户输入拼成语句。

数据库把数据存为具有约束的表，查询返回的是行而不是某个 Rust 对象的自动副本。应用要明确每列类型、空值与映射方式。SQLite 可以在进程内使用内存数据库，也可以打开文件保存到下次启动；本页先用内存数据库使例子可重复且不污染文件。

把用户输入直接拼进 SQL 会混淆数据与语法。使用占位符 ?1、?2 和 params! 绑定参数，让引号、中文甚至 SQL 片段都作为普通值处理。参数化不能替代业务校验、权限和所有 SQL 结构检查，但应成为数据值传入的默认方式。

rusqlite 是同步接口。异步应用不能在运行时工作线程上无约束执行长时间数据库操作，应使用适合的阻塞边界或选择异步驱动。连接池、事务隔离和迁移各有职责，本节先把连接、建表、写入和查询的失败沿 `Result` 返回，再在下一节处理原子提交。

<CourseCallout>

内存数据库用于可重复练习；文件数据库才会跨程序运行保留数据。

</CourseCallout>

## 亲手试一试

```rust playground id=sqlite-parameters
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
```

<CourseCallout title="给自己一个小挑战">

插入包含单引号的名称，确认使用绑定参数后仍能原样读取。

</CourseCallout>
