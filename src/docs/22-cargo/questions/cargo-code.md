---
id: cargo-code
kind: code
title: 实现与边界
type: question
chapterId: cargo
order: 6
---

定义私有 math 模块，公开 checked_double(n: `u32`) -&gt; `Option`&lt;`u32`&gt;；根级 `pub` `fn` run(n: `u32`) -&gt; `Option`&lt;`u32`&gt; 通过 `crate::math` 调用它，溢出返回 `None`。

```rust starter
mod math {
    pub fn checked_double(n: u32) -> Option<u32> {
        todo!()
    }
}

pub fn run(n: u32) -> Option<u32> {
    todo!()
}

fn main() {
    println!("{:?}", run(21));
}
```
