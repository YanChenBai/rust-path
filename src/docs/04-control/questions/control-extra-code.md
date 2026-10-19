---
id: control-extra-code
kind: code
title: 统计连续达标天数
type: question
chapterId: control
order: 7
assessment:
  explanation: 只统计从开头连续达标的天数，第一次失败立即 break；不要统计失败之后重新达标的天。
  answerSource: 04-control/src/bin/control-extra-code.rs?region=answer
  testsSource: 04-control/src/bin/control-extra-code.rs?region=tests
---

实现 `streak(minutes: &[u32], target: u32) -> usize`，从开头统计连续 minutes &gt;= target 的天数，第一次未达标就停止。空切片返回 0；target 为 0 时所有天均达标。例如 [30, 20, 5, 40]、目标 20 返回 2。

```rust starter source=04-control/starters/control-extra-code-starter.rs

```
