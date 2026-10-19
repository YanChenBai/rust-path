---
id: macros-extra-choice-2
kind: choice
title: 标签宏的重复求值
options:
  - (1, 1) 1
  - (2, 2) 2
  - (1, 2) 2
  - (0, 0) 0
type: question
chapterId: macros
order: 2
assessment:
  answer: (1, 2) 2
  explanation: 宏展开把传入表达式放入两个位置，元组元素从左到右求值，所以副作用发生两次。
  mode: fold
---

macro_rules! twice { ($value:expr) =&gt; { ($value, $value) }; }

```rust source=23-macros/snippets/macros-extra-choice-2-snippet-1.rs

```
