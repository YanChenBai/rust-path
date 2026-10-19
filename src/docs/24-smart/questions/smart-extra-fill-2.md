---
id: smart-extra-fill-2
kind: fill
title: 获取动态可变借用
type: question
chapterId: smart
order: 5
---

填方法名：

```rust
let count = std::cell::RefCell::new(0);
```

*count.____() += 1;

```rust
assert_eq!(*count.borrow(), 1);
```
