---
type: project
chapterId: enums
id: enums-project
title: 学习任务状态机
---

用携带数据的枚举代替互相冲突的布尔状态。

## 验收要求

- 定义 #[derive(`Debug`, PartialEq)] `enum` Task { Pending, Running(`u32`), Done(`u32`) }
- 实现 advance(task: Task, minutes: `u32`) -&gt; Task；Pending 在正分钟时按同样阈值进入 Running 或 Done，否则不变
- Running 用 saturating_add 累加，达到 60 进入 Done；Done 不再变化

```rust starter
#[derive(Debug, PartialEq)]
enum Task {
    Pending,
    Running(u32),
    Done(u32),
}
fn advance(task: Task, minutes: u32) -> Task {
    todo!()
}
fn main() {}
```
