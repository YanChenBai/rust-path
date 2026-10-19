---
id: control-extra-fill-1
kind: fill
title: 遇到停机标记
type: question
chapterId: control
order: 4
---

填一个关键字，让 total 为 20，而不是继续读取标记后的 30：

```rust
let mut total = 0;
for minutes in [20, 0, 30] {
    if minutes == 0 { ____; }
    total += minutes;
}
```
