---
id: traits-r2-code-1
kind: code
title: 实现行为契约
type: question
chapterId: traits
order: 6
---

定义 `trait` Score { `fn` score(&self)-&gt;`i32`; } 和 Fixed(`i32`)，为 Fixed 实现 Score。

```rust starter
trait Score { fn score(&self) -> i32; }

struct Fixed(i32);

impl Score for Fixed {
    fn score(&self) -> i32 { todo!() }
}

fn main() {}
```
