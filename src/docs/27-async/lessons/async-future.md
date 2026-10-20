---
id: async-future
title: Future、await 与运行时
subtitle: 异步不意味着自动启动新线程
minutes: 18
nativeRequired: true
dependencies:
  - tokio
type: lesson
chapterId: async
order: 0
advanced: true
---

## Future 描述尚未完成的计算，运行时负责驱动它。

调用 `async` `fn` 会构造一个 Future，而不是立即把整个函数执行完。Future 通过 poll 推进，可能返回 Ready，或在登记唤醒机制后返回 Pending。`await` 等待子 Future 就绪，等待期间允许当前任务让出执行机会；它不会天然为每个调用创建系统线程，也不是把阻塞调用自动转换为异步版本。

Tokio 提供调度器、计时器和异步 I/O 驱动等运行设施。普通同步 `main` 可以创建 Runtime 后 block_on，也可以用 `#[tokio::main]` 宏生成入口样板。学习评测会重命名示例入口再追加普通 `main`，因此参考答案用普通 `async` 函数，断言内部显式建立运行时，避免把入口宏附着到重命名后的函数上。

并发和并行需要区分：单线程运行时也能在多个等待中的任务之间切换，但 CPU 密集计算如果长期不让出执行，会阻塞同一调度线程上的其他任务。示例用 yield_now 展示可协作调度点，不用耗时睡眠来证明并发。Future 被丢弃后一般不再被轮询，其已发生的外部副作用不会回滚，因此设计接口时还要考虑在 `await` 处中断是否会留下不完整状态。

<CourseCallout>

依赖 tokio 1，运行器已启用 full；不要在一个异步任务内部嵌套 block_on。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

创建 Future 后先不 `await`，用 Cell 记录函数体何时真正开始执行。

</CourseCallout>

```rust playground id=async-future source=27-async/src/bin/async-future.rs

```
