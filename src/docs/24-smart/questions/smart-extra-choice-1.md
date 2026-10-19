---
id: smart-extra-choice-1
kind: choice
title: 共享草稿的计数
options:
  - '0'
  - '1'
  - '2'
  - 无法编译：Rc 不允许 clone
type: question
chapterId: smart
order: 1
---

```rust
use std::rc::Rc;
let draft = Rc::new(String::from("初稿"));
let copy = Rc::clone(&draft);
```

drop(`copy`);

```rust
println!("{}", Rc::strong_count(&draft)); 输出什么？
```
