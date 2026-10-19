---
id: cargo-extra-choice-2
kind: choice
title: 区分模块路径
options:
  - src/config.rs，pub fn port() -> u16 { 8080 }
  - config.rs，fn port() -> u16 { 8080 }
  - src/config.toml，pub fn port() -> u16 { 8080 }
  - Cargo.lock，fn port() -> u16 { 8080 }
type: question
chapterId: cargo
order: 2
assessment:
  answer: src/config.rs，pub fn port() -> u16 { 8080 }
  explanation: src/main.rs 的 mod config 在单文件布局下加载 src/config.rs；pub 允许父模块调用该函数。
  mode: exact
---

项目 `src/main.rs` 内容为 `mod config; fn main() { println!("{}", config::port()); }`。采用单文件模块布局时，port 应放在哪个路径，并如何声明才能从父模块调用？
