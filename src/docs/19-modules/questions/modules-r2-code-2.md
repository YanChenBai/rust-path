---
id: modules-r2-code-2
kind: code
title: 只公开构造与读取
type: question
chapterId: modules
order: 7
---

定义 mod model，公开结构体 Counter（私有 `u32` 字段），`pub` `fn` new(n:`u32`)-&gt;Self 与 `pub` `fn` get(&self)-&gt;`u32`。

```rust starter
mod model {
    pub struct Counter(u32);
    impl Counter {
        pub fn new(n: u32) -> Self { todo!() }
        pub fn get(&self) -> u32 { todo!() }
    }
}

fn main() {}
```
