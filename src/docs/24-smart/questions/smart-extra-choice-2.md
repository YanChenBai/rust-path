---
id: smart-extra-choice-2
kind: choice
title: 修改共享草稿
options:
  - 打印 AB
  - 编译器自动等待 view 释放
  - 无法编译：RefCell 不支持借用
  - 在 borrow_mut() 处发生运行时 panic
type: question
chapterId: smart
order: 2
---

```rust
use std::cell::RefCell;
let draft = RefCell::new(String::from("A"));
let view = draft.borrow();
let mut edit = draft.borrow_mut();
```

edit.push_str("B");

```rust
println!("{view}"); 会怎样？
```
