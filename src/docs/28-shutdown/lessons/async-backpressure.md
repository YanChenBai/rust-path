---
id: async-backpressure
title: 有界队列与背压
subtitle: 生产者比消费者快时，需要一个明确的容量边界。
minutes: 16
type: lesson
chapterId: shutdown
order: 1
---

## 生产者比消费者快时，需要一个明确的容量边界。

无界队列把处理压力推迟到内存上，生产者持续快于消费者时，待处理消息可能无限累积。有界 mpsc 队列满时，send().`await` 等待容量，生产者因此感受到下游速度，这叫背压。它不代表系统一定不会超载，还需要限制进入队列之前的任务数量与单条消息大小。

接收端关闭后发送会失败，所有发送端释放后 recv 返回 `None`。优雅退出常见顺序是停止接收新工作、释放生产者、排空已接收任务、等待消费者完成。只发出“取消”信号却不等待任务退出，不能证明清理完成。

select! 取消的是未选中的等待分支，具体操作是否取消安全仍要查 API 约定。已经开始的外部副作用不能靠丢弃 Future 自动回滚。示例只发送内存消息，不涉及外部服务，便于观察容量与关闭行为；后续实操要求保留顺序、处理错误并等待 join。

<CourseCallout>

有界队列限制队列内消息数，不等于自动限制所有已启动任务。

</CourseCallout>

## 亲手试一试

```rust playground id=async-backpressure
#[tokio::main]
async fn main() {
    let (tx, mut rx) = tokio::sync::mpsc::channel(1);

    // 启动消费任务，让有界队列中的消息能够持续被处理。
    let consumer = tokio::spawn(async move {
        // 累计本次处理结果，后续断言会检查最终数值。
        let mut total = 0;

        // 等待异步步骤完成；等待期间允许运行时调度其他就绪任务。
        while let Some(n) = rx.recv().await {
            total += n;
        }
        total
    });

    // 把消息交给接收端；如果通道已关闭，发送会返回错误。
    tx.send(2).await.unwrap();
    tx.send(3).await.unwrap();
    // 释放最后一个发送端，消费者排空队列后自然结束。
    drop(tx);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(consumer.await.unwrap(), 5);
}
```

<CourseCallout title="给自己一个小挑战">

把容量改为 1，给消费者增加短暂延迟，观察 send 的等待位置。

</CourseCallout>
