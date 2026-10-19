---
id: control-extra-choice-1
kind: choice
title: 跳过休息日
options:
  - '12'
  - '15'
  - '3'
  - '9'
type: question
chapterId: control
order: 1
---

统计学习积分，下面代码打印什么？

```rust
let mut score = 0;
for day in 1..=5 {
    if day == 3 { continue; }
    score += day;
}
println!("{score}");
```
