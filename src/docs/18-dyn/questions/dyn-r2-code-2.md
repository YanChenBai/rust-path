---
id: dyn-r2-code-2
kind: code
title: 实现具体对象
type: question
chapterId: dyn
order: 7
---

定义 `trait` Named { `fn` name(&self) -&gt; `&str`; }，结构体 User(`String`)，为 User 实现 Named。

```rust starter
trait Named { fn name(&self) -> &str; }

struct User(String);

impl Named for User {
    fn name(&self) -> &str { todo!() }
}

fn main() {}
```
