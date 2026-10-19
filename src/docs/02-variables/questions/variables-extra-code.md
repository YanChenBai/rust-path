---
id: variables-extra-code
kind: code
title: 拆分计时器读数
type: question
chapterId: variables
order: 7
---

实现 split_seconds(total: `u32`) -&gt; (`u32`, `u32`)，返回 (完整分钟数, 剩余秒数)，例如 125 返回 (2, 5)。必须覆盖从 0 到 `u32::MAX` 的所有输入。

```rust starter
fn split_seconds(total: u32) -> (u32, u32) {
    todo!()
}

fn main() {
    println!("{:?}", split_seconds(125));
}
```
