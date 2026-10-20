---
id: ecosystem-extra-choice-1
kind: choice
title: 读取 JSON 计划
options:
  - '25'
  - Some(25)
  - None
  - Some("25")
type: question
chapterId: ecosystem
order: 1
assessment:
  answer: Some(25)
  explanation: JSON 数字可通过 as_u64 提取，方法返回 Option<u64>，调试输出保留 Some。
  mode: exact
---

```rust source=29-ecosystem/snippets/ecosystem-extra-choice-1-snippet-1.rs

```

输出什么？
