---
type: project
chapterId: variables
id: variables-project
title: 学习时间计算器
---

把每天的零散学习时间，换算成一份清晰的学习报告。

## 验收要求

- 实现 report(days: `u32`, minutes: `u32`) -&gt; (`u32`, `u32`)
- 计算每天 minutes 分钟、共 days 天的总时长
- 返回 (完整小时数, 剩余分钟数)，例如 (2, 15)

```rust starter
fn report(days: u32, minutes: u32) -> (u32, u32) {
    todo!()
}

fn main() {
    println!("{:?}", report(3, 45));
}
```
