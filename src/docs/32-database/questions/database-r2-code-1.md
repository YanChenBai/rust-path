---
id: database-r2-code-1
kind: code
title: 安全插入名称
type: question
chapterId: database
order: 6
assessment:
  explanation: '实现 insert_name(db: &rusqlite::Connection, name: &str) -> rusqlite::Result<usize>，参数化写入已存在的 names(value TEXT NOT NULL) 表。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 32-database/src/bin/database-r2-code-1.rs?region=answer
  testsSource: 32-database/src/bin/database-r2-code-1.rs?region=tests
---

实现 `insert_name(db: &rusqlite::Connection, name: &str) -> rusqlite::Result<usize>`，参数化写入已存在的 names(value TEXT NOT NULL) 表。

```rust starter source=32-database/starters/database-r2-code-1-starter.rs

```
