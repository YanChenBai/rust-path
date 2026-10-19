---
id: variables-extra-choice-1
kind: choice
title: 整理自习时长
options:
  - 90:0
  - 1:30
  - 1:0
  - 无法编译：遮蔽不能改变类型
type: question
chapterId: variables
order: 1
---

执行下列代码，输出是什么？

```rust
let minutes = " 90 ";
let minutes = minutes.trim().parse::<u32>().unwrap();
println!("{}:{}", minutes / 60, minutes % 60);
```
