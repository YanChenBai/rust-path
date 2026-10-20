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
assessment:
  answer: 在 borrow_mut() 处发生运行时 panic
  explanation: view 的共享借用仍活跃，RefCell 在运行时阻止同时获取独占可变借用。
  mode: exact
---

```rust source=24-smart/snippets/smart-extra-choice-2-snippet-1.rs

```

edit.push_str("B");

```rust source=24-smart/snippets/smart-extra-choice-2-snippet-2.rs

```

会怎样？
