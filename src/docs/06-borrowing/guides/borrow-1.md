---
type: guide
lessonId: borrow
index: 1
title: 最后一次读取之后再修改
---

### 2. 最后一次读取之后再修改

下面先借用 text 并打印，随后追加字符；first 不再使用，所以共享借用已经结束。然后创建可变引用追加感叹号，最后重新读取原值。示例同时比较 UTF-8 字节数、标量值数量和切片边界：“你”占三个字节，下标一落在编码中间，get 返回 `None`；零至三则恰好切出整个“你”。

```rust runnable id=borrow-guide-1 source=06-borrowing/src/bin/borrow-guide-1.rs

```
