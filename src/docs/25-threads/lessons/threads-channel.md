---
id: threads-channel
title: move、join 与 mpsc
subtitle: 先约定工作如何结束
minutes: 18
nativeRequired: true
type: lesson
chapterId: threads
order: 0
---

## 线程生命周期与数据生命周期必须一同设计。

`thread::spawn` 启动独立线程，返回 JoinHandle。闭包通常需要拥有捕获数据，因此 `move` 很常见；它改变捕获方式，却不会把内部引用指向的数据延长成静态生命。普通 spawn 要求捕获满足相应的 Send 与 'static 约束，若确实要借用当前栈数据，可以研究 scoped threads，而不是用泄漏数据绕过检查。

join 等待工作线程结束，并用 `Result` 表达线程是否恐慌。丢弃句柄并不等于取消线程，`main` 结束也不会自动等待所有未回收工作。需要稳定测试时，应通过 join、通道或同步屏障确认完成，不能用 sleep 猜测结果已经准备好。示例由工作线程持有发送端并返回计算结果，主线程回收句柄后验证一致性。

mpsc 是多发送者、单接收者通道，发送通常转移值的所有权。接收迭代器会等到所有发送端释放后才结束，因此保留一份不用的 sender 就可能让循环一直等。无界 channel 也不是免费的缓冲，可以持续增长内存；需要背压时考虑 sync_channel 或其他有界设计。程序还应区分业务错误、发送失败与线程恐慌，而不是把所有错误都写成忽略结果。

<CourseCallout>

同步互等前检查通道容量与锁持有情况，避免双方都在等对方推进。

</CourseCallout>

## 亲手试一试

```rust playground id=threads-channel
use std::sync::mpsc;
use std::thread;

fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = vec![1i32, 2, 3];
    let (sender, receiver) = mpsc::channel();

    // 保存工作线程或任务的句柄，稍后需要等待并检查完成结果。
    let worker = thread::spawn(move || {
        // 累计本次处理结果，后续断言会检查最终数值。
        let total: i64 = values.into_iter().map(i64::from).sum();

        // 把消息交给接收端；如果通道已关闭，发送会返回错误。
        sender.send(total).expect("接收端存在");
        total
    });

    // 收集接收到的消息，后面再验证数量或顺序。
    let messages: Vec<_> = receiver.into_iter().collect();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(messages, vec![6]);

    // 等待线程结束后再读取最终结果。
    assert_eq!(worker.join().expect("线程成功"), 6);
}
```

<CourseCallout title="给自己一个小挑战">

增加两个发送线程，丢弃根 sender 后收集并排序，避免依赖消息到达顺序。

</CourseCallout>
