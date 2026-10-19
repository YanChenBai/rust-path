---
id: macros-extra-code
kind: code
title: 生成标签列表宏
type: question
chapterId: macros
order: 7
assessment:
  explanation: 重复匹配接受零个或多个表达式，$(,)? 接受可选尾逗号。展开时每个表达式仅出现在一个 format! 中；显式 Vec<String> 保证空调用也可推断类型。
  answerSource: 23-macros/src/bin/macros-extra-code.rs?region=answer
  testsSource: 23-macros/src/bin/macros-extra-code.rs?region=tests
---

定义 macro_rules! labels，支持 labels!()、labels!(expr, expr) 及可选尾逗号，返回 `Vec<String>`。每个表达式只求值一次，按顺序通过 `format!`("{}", 值) 转换。另实现 `sample_labels() -> Vec<String>`，调用 labels!("Rust", 2024) 返回示例。

```rust starter source=23-macros/starters/macros-extra-code-starter.rs

```
