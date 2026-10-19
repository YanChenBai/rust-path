---
id: cargo-extra-fill-2
kind: fill
title: 从父模块公开路径
type: question
chapterId: cargo
order: 5
---

填可见性关键字，使 `config::port()` 能被父模块调用：

```rust
mod config {
    ____ fn port() -> u16 { 8080 }
}

fn main() { println!("{}", config::port()); }
```
