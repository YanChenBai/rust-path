---
id: cargo-extra-code
kind: code
title: 使用配置模块选择端口
type: question
chapterId: cargo
order: 7
assessment:
  explanation: 用内联模块练习路径和可见性，无须创建额外文件。None 调用默认端口函数，Some(0) 也属于显式配置，不能误当作缺失。
  answerSource: 22-cargo/src/bin/cargo-extra-code.rs?region=answer
  testsSource: 22-cargo/src/bin/cargo-extra-code.rs?region=tests
---

在单个源码中定义内联 mod config，其中 `pub fn default_port() -> u16` 返回 8080；实现顶层 `selected_port(value: Option<u16>) -> u16`。`Some(port)` 保留原值（包括 0），`None` 通过 `config::default_port()` 取得默认值。测试也会直接调用该模块函数。

```rust starter source=22-cargo/starters/cargo-extra-code-starter.rs

```
