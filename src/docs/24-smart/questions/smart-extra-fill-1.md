---
id: smart-extra-fill-1
kind: fill
title: 单线程共享所有权
type: question
chapterId: smart
order: 4
assessment:
  answer: Rc
  explanation: Rc 提供单线程引用计数共享所有权；克隆 Rc 不会克隆内部 String。
  mode: exact
---

填标准库类型名，不用 Arc：

```rust source=24-smart/snippets/smart-extra-fill-1-snippet-1.rs

```
