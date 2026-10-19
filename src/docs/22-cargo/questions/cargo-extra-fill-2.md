---
id: cargo-extra-fill-2
kind: fill
title: 从父模块公开路径
type: question
chapterId: cargo
order: 5
assessment:
  answer: pub
  explanation: 子模块默认私有的函数不能被父模块调用；pub 明确开放访问。
  mode: exact
---

填可见性关键字，使 `config::port()` 能被父模块调用：

```rust source=22-cargo/snippets/cargo-extra-fill-2-snippet-1.rs

```
