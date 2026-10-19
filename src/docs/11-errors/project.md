---
type: project
chapterId: errors
id: errors-project
title: 可靠的逐行导入
assessment:
  explanation: 用显式匹配和错误传播组织全部成功或整体失败。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 11-errors/src/bin/errors-project.rs?region=answer
  testsSource: 11-errors/src/bin/errors-project.rs?region=tests
---

用显式匹配和错误传播组织全部成功或整体失败。

## 验收要求

- 实现 `import_minutes(input:&str)->Result<Vec<u32>,String>`
- 忽略空白行，每个非空行 trim 后必须为 1..=180
- 任一失败返回 `Err`，不返回部分数据；成功时按原顺序返回

```rust starter source=11-errors/starters/errors-project-starter.rs

```
