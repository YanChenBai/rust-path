---
id: smart-extra-fill-1
kind: fill
title: 单线程共享所有权
type: question
chapterId: smart
order: 4
---

填标准库类型名，不用 Arc：

```rust
use std::rc::Rc;
let draft = ____::new(String::from("初稿"));
let backup = Rc::clone(&draft);
```
