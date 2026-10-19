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
