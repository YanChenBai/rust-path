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
---

macro_rules! tag { ($value:expr) =&gt; { `format!`("[{}]", $value) }; }

```rust
println!("{}", tag!(1 + 2)); 输出什么？
```
