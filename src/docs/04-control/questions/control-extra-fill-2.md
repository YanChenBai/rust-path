---
id: control-extra-fill-2
kind: fill
title: 包含最后一天
type: question
chapterId: control
order: 5
---

填范围运算符，恰好处理第 1、2、3 天：

```rust
let mut days = 0;
for _ in 1____3 { days += 1; }
assert_eq!(days, 3);
```
