---
type: project
chapterId: strings
id: strings-project
title: 中文学习日志摘要
assessment:
  explanation: 把文本清洗、Unicode 计数与集合组合成报告。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 07-strings/src/bin/strings-project.rs?region=answer
  testsSource: 07-strings/src/bin/strings-project.rs?region=tests
---

把文本清洗、Unicode 计数与集合组合成报告。

## 验收要求

- 实现 `summarize(input: &str, limit: usize) -> Vec<String>`
- 忽略空白行，每行先 trim，再取前 limit 个 Unicode 标量值
- 保持原行顺序；limit=0 时每条非空记录变为空字符串

```rust starter source=07-strings/starters/strings-project-starter.rs

```
