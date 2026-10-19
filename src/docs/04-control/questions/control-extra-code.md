---
id: control-extra-code
kind: code
title: 统计连续达标天数
type: question
chapterId: control
order: 7
---

实现 streak(minutes: &[`u32`], target: `u32`) -&gt; `usize`，从开头统计连续 minutes &gt;= target 的天数，第一次未达标就停止。空切片返回 0；target 为 0 时所有天均达标。例如 [30, 20, 5, 40]、目标 20 返回 2。

```rust starter
fn streak(minutes: &[u32], target: u32) -> usize {
    todo!()
}

fn main() {
    println!("{}", streak(&[30, 20, 5, 40], 20));
}
```
