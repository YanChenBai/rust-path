---
id: macros-extra-fill-2
kind: fill
title: 重复零次或多次
type: question
chapterId: macros
order: 5
---

填重复运算符（一个字符），使宏同时接受 list!() 和 list!(1, 2)：
macro_rules! list {
($($value:expr),____) =&gt; { `vec!`[$($value),*] };

```rust
}
```
