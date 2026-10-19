---
id: stdlib-iter-time
title: 惰性迭代与时间测量
subtitle: 消费发生在哪里，成本就发生在哪里
minutes: 18
type: lesson
chapterId: iterators
order: 1
advanced: true
---

## 迭代器控制数据流，Instant 测量经过时间。

iter 借用集合元素，iter_mut 提供独占借用，into_iter 对拥有的集合通常会消费并移出元素。map 和 filter 只构造新的迭代器，直到 collect、sum、fold 或 `for` 真正消费才执行处理。闭包接收到的引用层级取决于迭代器的 Item 与适配器签名，尤其 filter 的谓词借用当前元素，不要仅靠反复加星号来试错。

示例先 copied 把 &`u32` 变成 `u32`，再转换到 `u64` 后做乘法，避免窄整数先溢出。把过滤和映射融合成流水线不意味着任何情况下都会比显式循环快；清晰的类型和正确的边界比缩短代码更重要。需要提前停止并传播错误时，可以选择 try_fold 或 collect 到 `Result`，而不是把错误默默 filter 掉。

Duration 表示时间长度，Instant 用于测量单调经过时间，SystemTime 表达墙上时钟并可能受校时影响而回拨。不要在测试中断言某段工作恰好耗费几毫秒，调度与机器负载会引入变化。示例只验证算出的业务总量，用 elapsed 展示观测值；生产计时还需要重复采样并避免把打印和编译成本混入目标操作。

<CourseCallout>

Instant 不能直接持久化为日历时间；需要时间戳时使用 SystemTime 并处理错误。

</CourseCallout>

## 亲手试一试

```rust playground id=stdlib-iter-time source=15-iterators/src/bin/stdlib-iter-time.rs

```

<CourseCallout title="给自己一个小挑战">

把求和改为 try_fold 并使用 checked_add，说明错误为何不能用 filter_map 丢弃。

</CourseCallout>
