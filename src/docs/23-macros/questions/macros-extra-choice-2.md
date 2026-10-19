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
---

macro_rules! twice { ($value:expr) =&gt; { ($value, $value) }; }

```rust
let mut n = 0;
let pair = twice!({ n += 1; n });
println!("{pair:?} {n}"); 输出什么？
```
