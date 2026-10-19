---
id: database-r2-code-2
kind: code
title: 空表总时长
type: question
chapterId: database
order: 7
assessment:
  explanation: '实现 total_minutes(db: &rusqlite::Connection) -> rusqlite::Result<i64>，对已存在 logs(minutes INTEGER NOT NULL) 表求和，空表为 0。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 32-database/src/bin/database-r2-code-2.rs?region=answer
  testsSource: 32-database/src/bin/database-r2-code-2.rs?region=tests
---

实现 `total_minutes(db: &rusqlite::Connection) -> rusqlite::Result<i64>`，对已存在 logs(minutes INTEGER NOT NULL) 表求和，空表为 0。

```rust starter source=32-database/starters/database-r2-code-2-starter.rs

```
