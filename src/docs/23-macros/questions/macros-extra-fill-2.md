---
id: macros-extra-fill-2
kind: fill
title: 重复零次或多次
type: question
chapterId: macros
order: 5
assessment:
  answer: '*'
  explanation: '* 表示零次或多次重复；+ 至少一次，不能匹配 list!()。'
  mode: fold
---

填重复运算符（一个字符），使宏同时接受 list!() 和 list!(1, 2)：
macro_rules! list {
`($($value:expr),____) => { vec![$($value),*] };`

```rust source=23-macros/snippets/macros-extra-fill-2-snippet-1.rs

```
