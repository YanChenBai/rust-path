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
assessment:
  answer: '1'
  explanation: clone 增加强引用计数到 2，drop(copy) 后降回 1，draft 仍然持有数据。
  mode: fold
---

```rust source=24-smart/snippets/smart-extra-choice-1-snippet-1.rs

```

`drop(copy);`

```rust source=24-smart/snippets/smart-extra-choice-1-snippet-2.rs

```

输出什么？
