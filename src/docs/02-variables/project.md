---
type: project
chapterId: variables
id: variables-project
title: 学习时间计算器
assessment:
  explanation: 用除法计算小时，用取余计算剩余分钟。练习输入限定在不会使 u32 溢出的范围。
  answerSource: 02-variables/src/bin/variables-project.rs?region=answer
  testsSource: 02-variables/src/bin/variables-project.rs?region=tests
---

把每天的零散学习时间，换算成一份清晰的学习报告。

## 验收要求

- 实现 `report(days: u32, minutes: u32) -> (u32, u32)`
- 计算每天 minutes 分钟、共 days 天的总时长
- 返回 (完整小时数, 剩余分钟数)，例如 (2, 15)

```rust starter source=02-variables/starters/variables-project-starter.rs

```
