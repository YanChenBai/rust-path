---
type: project
chapterId: combinators
id: combinators-project
title: 带行号的严格导入
assessment:
  explanation: 结合迭代与错误上下文，保证数据没有被静默丢弃。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 16-combinators/src/bin/combinators-project.rs?region=answer
  testsSource: 16-combinators/src/bin/combinators-project.rs?region=tests
---

结合迭代与错误上下文，保证数据没有被静默丢弃。

## 验收要求

- 实现 `parse_rows(input: &str) -> Result<Vec<u32>, String>`
- 跳过空白行，按原始行号从 1 计数；合法 `u32`（含 0）保留
- 首个非法行返回 line:N，其中 N 是原始行号

```rust starter source=16-combinators/starters/combinators-project-starter.rs

```
