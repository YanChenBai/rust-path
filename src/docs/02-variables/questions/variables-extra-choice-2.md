---
id: variables-extra-choice-2
kind: choice
title: 局部调整目标
options:
  - |-
    45
    45
  - |-
    30
    45
  - |-
    45
    30
  - 无法编译：target 必须为 mut
type: question
chapterId: variables
order: 2
---

执行下列代码，最后打印什么？

```rust
let target = 30;
{ let target = target + 15; println!("{target}"); }
println!("{target}");
```
