---
type: project
chapterId: database
id: database-project
title: 原子批量导入学习记录
assessment:
  explanation: 在真实 SQLite 事务中组合解析后的数据、约束与回滚。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 32-database/src/bin/database-project.rs?region=answer
  testsSource: 32-database/src/bin/database-project.rs?region=tests
---

在真实 SQLite 事务中组合解析后的数据、约束与回滚。

## 验收要求

- 实现 `import_batch(db: &mut rusqlite::Connection, values: &[i64]) -> Result<usize,String>`
- 表 logs(minutes INTEGER NOT NULL CHECK(minutes BETWEEN 1 AND 180)) 已存在；全部合法才写入并提交
- 任一非法值或 SQL 错误返回 `Err`，整批不得留下部分写入；空批次返回 `Ok(0)`

```rust starter source=32-database/starters/database-project-starter.rs

```
