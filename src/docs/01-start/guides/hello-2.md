---
type: guide
lessonId: hello
index: 2
title: 编译环境与 Edition 是两件事
---

### 3. 编译环境与 Edition 是两件事

rustc 的版本决定可用的语言功能和标准库接口，Edition 决定部分语法与兼容性规则。本教程以本机 rustc 1.96 和 Rust 2024 为基准。单文件可保存为 `main.rs`，用 `rustc --edition=2024 main.rs` 编译后运行生成的程序；Cargo 项目则在 Cargo.toml 的 package 中设置 edition = "2024"，再用 cargo run 构建并运行。
