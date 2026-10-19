async fn value() -> u32 {
    // 等待异步步骤完成；等待期间允许运行时调度其他就绪任务。
    tokio::task::yield_now().await;
    21
}

fn main() {
    // 创建驱动 Future 的异步运行时；声明 async 本身不会启动它。
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();

    // 构造尚未完成的 Future，等待驱动后才产生最终结果。
    let pending = value();

    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = runtime.block_on(async { pending.await * 2 });

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(result, 42);
}
