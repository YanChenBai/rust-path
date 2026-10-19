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
