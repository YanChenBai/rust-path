---
id: cargo-code
kind: code
title: 实现与边界
type: question
chapterId: cargo
order: 6
assessment:
  explanation: 'pub 暴露模块成员，crate:: 从当前 crate 根定位；checked_mul 保留溢出信息。'
  answerSource: 22-cargo/src/bin/cargo-code.rs?region=answer
  testsSource: 22-cargo/src/bin/cargo-code.rs?region=tests
---

定义私有 math 模块，公开 `checked_double(n: u32) -> Option<u32>`；根级 `pub fn run(n: u32) -> Option<u32>` 通过 `crate::math` 调用它，溢出返回 `None`。

```rust starter source=22-cargo/starters/cargo-code-starter.rs

```
