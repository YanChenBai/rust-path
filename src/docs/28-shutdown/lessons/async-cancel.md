---
id: async-cancel
title: select!、取消与阻塞工作
subtitle: 放弃等待不总是停止执行
minutes: 18
nativeRequired: true
dependencies:
  - tokio
type: lesson
chapterId: shutdown
order: 0
---

## 明确取消对象是 Future、异步任务还是阻塞闭包。

select! 并发轮询多个分支，选中一个匹配结果后，其他普通分支 Future 通常被丢弃。它们是否能安全重试取决于具体 API 的取消安全性，例如接收操作与部分读写操作可能有不同保证。不要笼统地认为取消等于回滚；已经发送的请求、写出的字节和提交的业务状态都可能继续存在，需要协议与状态机提供恢复策略。

已 spawn 的任务独立存在，丢弃 JoinHandle 会分离任务而非取消它。通常需要 abort，再 `await` 句柄确认取消完成；任务如果已经完成，结果也可能是正常完成。示例故意让任务永远 Pending，因此取消断言可确定，不靠计时器与机器负载竞争。biased 指定从上到下检查分支，只适合应用确实需要优先级且能避免饥饿的情况。

`std::thread::sleep`、同步文件读取或长时间 CPU 计算会阻塞异步执行线程。spawn_blocking 可把同步工作交给阻塞池，但已开始的阻塞闭包通常不能靠 abort 强制停止，需要显式协作取消或独立进程等设计。对耗时无界的任务还要设置资源与退出策略。本例仅提交有限计算并等待完成，清楚地区分异步任务取消和阻塞任务回收。

<CourseCallout>

Tokio timeout 取消的是被包裹的 Future；若只包裹 JoinHandle，后台任务仍需显式处理。

</CourseCallout>

## 亲手试一试

```rust playground id=async-cancel
fn main() {
    // 创建驱动 Future 的异步运行时；声明 async 本身不会启动它。
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();
    runtime.block_on(async {
        // 保存任务句柄，不能把启动任务误当作任务已经完成。
        let mut job = tokio::spawn(std::future::pending::<u32>());

        // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
        let result = tokio::select! {
            biased;
            _ = std::future::ready(()) => "cancel",
            _ = &mut job => "done",
        };

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(result, "cancel");
        job.abort();

        // 等待任务就绪时让出执行机会，不等同于阻塞当前线程。
        assert!(job.await.unwrap_err().is_cancelled());

        // 累计本次处理结果，后续断言会检查最终数值。
        let total = tokio::task::spawn_blocking(|| (1u64..=100).sum::<u64>())
            .await
            .unwrap();
        assert_eq!(total, 5050);
    });
}
```

<CourseCallout title="给自己一个小挑战">

为 select 增加取消信号，分别验证取消优先与正常完成；始终回收已启动任务。

</CourseCallout>
