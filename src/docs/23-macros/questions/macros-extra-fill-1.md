---
id: macros-extra-fill-1
kind: fill
title: 匹配一个表达式
type: question
chapterId: macros
order: 4
assessment:
  answer: expr
  explanation: expr 匹配表达式，包括字面量、运算和函数调用。
  mode: exact
---

填宏片段指定符，使调用 bracket!(2 + 3) 合法：
macro_rules! bracket {
`($value:____) => { format!("[{}]", $value) };`

```rust source=23-macros/snippets/macros-extra-fill-1-snippet-1.rs

```
