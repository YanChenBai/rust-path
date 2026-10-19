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
---

```rust
let minutes = 30; let xp = match minutes { 0..=14 => 0, 15..=29 => 10, _ => 25 }; println!("{xp}"); 输出什么？
```
