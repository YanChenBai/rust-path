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
