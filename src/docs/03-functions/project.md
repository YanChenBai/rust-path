---
type: project
chapterId: functions
id: functions-project
title: 多日学习时间计算器
assessment:
  explanation: 组合函数、参数、返回值与整数运算，不提前要求分支语法。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 03-functions/src/bin/functions-project.rs?region=answer
  testsSource: 03-functions/src/bin/functions-project.rs?region=tests
---

组合函数、参数、返回值与整数运算，不提前要求分支语法。

## 验收要求

- 实现 `daily(hours:u32, extra:u32)->u64`，小时转分钟后加 extra
- 实现 `plan(days:u32, hours:u32, extra:u32)->u64`，调用 daily 后乘 days
- 测试输入保证最终结果不超过 `u64`；0 天返回 0

```rust starter source=03-functions/starters/functions-project-starter.rs

```
