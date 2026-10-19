---
id: models-r2-code-2
kind: code
title: 饱和计数器
type: question
chapterId: models
order: 7
---

定义 Counter { value:`u32` }，实现 add(&`mut` self,n:`u32`)，溢出时停在 `u32::MAX`。

```rust starter
struct Counter { value: u32 }

impl Counter {
    fn add(&mut self, n: u32) { todo!() }
}

fn main() {}
```
