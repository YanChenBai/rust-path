---
type: project
chapterId: shared
id: shared-project
title: 共享库存并发扣减
---

组合 Arc、Mutex、线程等待与业务不变量。

## 验收要求

- 实现 sell(stock: `u32`, requests: `Vec`&lt;`u32`&gt;) -&gt; (`u32`, `usize`)
- 每条请求放入独立线程，库存足够才原子地扣减并计入成功次数；请求 0 合法
- 返回剩余库存与成功次数；并发顺序不作保证，但所有成功扣减必须守住库存约束

```rust starter
fn sell(stock: u32, requests: Vec<u32>) -> (u32, usize) {
    todo!()
}
fn main() {}
```
