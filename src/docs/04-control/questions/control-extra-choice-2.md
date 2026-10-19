---
id: control-extra-choice-2
kind: choice
title: 积分分档边界
options:
  - '0'
  - '10'
  - '25'
  - 无法编译：范围不能用于 match
type: question
chapterId: control
order: 2
assessment:
  answer: '25'
  explanation: 30 不在 0..=14 或 15..=29 中，因此进入通配分支得到 25。
  mode: fold
---

```rust source=04-control/snippets/control-extra-choice-2-snippet-1.rs

```
