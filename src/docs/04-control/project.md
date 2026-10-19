---
type: project
chapterId: control
id: control-project
title: 学习积分结算器
assessment:
  explanation: 分别累计每日奖励和有效学习天数，在循环后结算额外奖励。
  answerSource: 04-control/src/bin/control-project.rs?region=answer
  testsSource: 04-control/src/bin/control-project.rs?region=tests
---

把变量、循环与分支组合起来，为一周的学习记录结算奖励。

## 验收要求

- 实现 `weekly_xp(minutes: &[u32]) -> u32`
- 每天少于 15 分钟得 0 分，15–29 分钟得 10 分，30 分钟及以上得 25 分
- 累计至少 5 天学习满 15 分钟，额外奖励 50 分

```rust starter source=04-control/starters/control-project-starter.rs

```
