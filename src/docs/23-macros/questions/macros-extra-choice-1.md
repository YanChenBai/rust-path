---
id: macros-extra-choice-1
kind: choice
title: 展开标签宏
options:
  - '[1 + 2]'
  - '[3]'
  - '3'
  - 无法编译：宏不能接收表达式
type: question
chapterId: macros
order: 1
assessment:
  answer: '[3]'
  explanation: $value:expr 接收整个 1 + 2 表达式，展开后 format! 格式化其计算结果 3。
  mode: fold
---

`macro_rules! tag { ($value:expr) => { format!("[{}]", $value) }; }`

```rust source=23-macros/snippets/macros-extra-choice-1-snippet-1.rs

```
