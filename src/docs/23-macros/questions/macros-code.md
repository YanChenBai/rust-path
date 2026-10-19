---
id: macros-code
kind: code
title: 实现与边界
type: question
chapterId: macros
order: 6
assessment:
  explanation: 每个表达式只在展开后的累加语句中出现一次；练习保证总和不溢出 i64。
  answerSource: 23-macros/src/bin/macros-code.rs?region=answer
  testsSource: 23-macros/src/bin/macros-code.rs?region=tests
---

实现 total_i64! 宏，接受零个或多个逗号分隔表达式和可选尾逗号，每个表达式恰好执行一次，以 `i64::from` 转换后累加，返回 `i64`。输入总和保证不溢出。

```rust starter source=23-macros/starters/macros-code-starter.rs

```
