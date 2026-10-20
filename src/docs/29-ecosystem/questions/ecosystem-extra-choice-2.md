---
id: ecosystem-extra-choice-2
kind: choice
title: 字符串不是 JSON 数字
options:
  - Some(25)
  - Some(0)
  - None
  - 运行时 panic：索引不能用于 Value
type: question
chapterId: ecosystem
order: 2
assessment:
  answer: None
  explanation: JSON 字符串与数字是不同类型；as_u64 不会自动把字符串 "25" 解析成整数。
  mode: exact
---

```rust source=29-ecosystem/snippets/ecosystem-extra-choice-2-snippet-1.rs

```

输出什么？
