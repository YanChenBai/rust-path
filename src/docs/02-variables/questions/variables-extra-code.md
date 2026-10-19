---
id: variables-extra-code
kind: code
title: 拆分计时器读数
type: question
chapterId: variables
order: 7
assessment:
  explanation: 除法得到完整分钟，取余得到不足一分钟的秒数；不先做乘法，因此最大 u32 输入也不会溢出。
  answerSource: 02-variables/src/bin/variables-extra-code.rs?region=answer
  testsSource: 02-variables/src/bin/variables-extra-code.rs?region=tests
---

实现 `split_seconds(total: u32) -> (u32, u32)`，返回 (完整分钟数, 剩余秒数)，例如 125 返回 (2, 5)。必须覆盖从 0 到 `u32::MAX` 的所有输入。

```rust starter source=02-variables/starters/variables-extra-code-starter.rs

```
