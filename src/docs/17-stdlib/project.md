---
type: project
chapterId: stdlib
id: stdlib-project
title: 嵌套结果分类器
assessment:
  explanation: 组合 Option、Result、范围模式与借用观察。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 17-stdlib/src/bin/stdlib-project.rs?region=answer
  testsSource: 17-stdlib/src/bin/stdlib-project.rs?region=tests
---

组合 `Option`、`Result`、范围模式与借用观察。

## 验收要求

- 实现 `classify_rows(rows:&[Option<Result<u32,String>>])->(usize,usize,usize)`
- 分别统计有效值（1..=180）、缺失（`None`）、非法（`Err` 或范围外 `Ok`）
- 只能借用输入，返回三个计数；空输入均为 0

```rust starter source=17-stdlib/starters/stdlib-project-starter.rs

```
