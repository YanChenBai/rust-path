---
id: async-spawn
title: spawn、join 与结果顺序
subtitle: 并发任务的所有权也要回收
minutes: 18
nativeRequired: true
dependencies:
  - tokio
type: lesson
chapterId: async
order: 1
---

## join! 同任务并发轮询，spawn 创建独立调度任务。

`tokio::join`! 把多个 Future 放在当前任务里共同推进，不等于把它们分配给多个线程。`tokio::spawn` 创建独立调度任务，并返回 JoinHandle；普通 spawn 要求 Future 与输出满足 Send 和 'static 等约束，这与数据可能跨工作线程移动有关。`async` `move` 让异步块拥有捕获值，但仍然需要检查捕获值内部是否包含短生命周期借用。

等待 JoinHandle 得到的 `Result` 表达任务是否恐慌或被取消；如果任务本身还返回 `Result`，就会出现两层错误，不能只处理最外层。join! 会等待各分支完成，不会因为其中一个业务 `Result` 是 `Err` 就自动取消其余工作；try_join! 的提前失败行为又有不同语义。选择组合方式时要明确错误后其他任务是否仍应继续。

示例同时展示 join! 与 spawn，并显式等待句柄。要保持输出与输入同序，可以把句柄按输入顺序收集并依次等待，任务仍已全部启动；若按完成顺序输出，则需要另一种收集策略。真实大量任务还要限制并发数，不能对无界输入逐项 spawn。教学练习只处理有限小列表，重点是结果类型、所有权以及完整回收，不把任务数量增长当作性能优化。

<CourseCallout>

跨 `await` 持有 `std::sync::MutexGuard` 可能阻塞并导致 Future 不满足 Send，先缩短锁范围。

</CourseCallout>

## 亲手试一试

```rust playground id=async-spawn
async fn compute(value: u32) -> u64 {
    // 等待异步步骤完成；等待期间允许运行时调度其他就绪任务。
    tokio::task::yield_now().await;
    u64::from(value) * 2
}

fn main() {
    // 创建驱动 Future 的异步运行时；声明 async 本身不会启动它。
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();
    runtime.block_on(async {
        let (left, right) = tokio::join!(compute(2), compute(3));

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!((left, right), (4, 6));

        // 保存当前步骤得到的值，后续通过接口检查或转换。
        let value = String::from("owned");

        // 保存任务句柄，不能把启动任务误当作任务已经完成。
        let job = tokio::spawn(async move { value.len() });
        assert_eq!(job.await.unwrap(), 5);
    });
}
```

<CourseCallout title="给自己一个小挑战">

把工作函数改成 `Result`，分别处理业务 `Err` 与 JoinError，不用双重 unwrap。

</CourseCallout>
