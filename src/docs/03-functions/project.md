---
type: project
chapterId: functions
id: functions-project
title: 多日学习时间计算器
---

组合函数、参数、返回值与整数运算，不提前要求分支语法。

## 验收要求

- 实现 daily(hours:`u32`, extra:`u32`)-&gt;`u64`，小时转分钟后加 extra
- 实现 plan(days:`u32`, hours:`u32`, extra:`u32`)-&gt;`u64`，调用 daily 后乘 days
- 测试输入保证最终结果不超过 `u64`；0 天返回 0

```rust starter
fn daily(hours: u32, extra: u32) -> u64 {
    todo!()
}
fn plan(days: u32, hours: u32, extra: u32) -> u64 {
    todo!()
}
fn main() {}
```
