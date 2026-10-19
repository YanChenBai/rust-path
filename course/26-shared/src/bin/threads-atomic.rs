use std::sync::{
    Arc,
    atomic::{AtomicUsize, Ordering},
};

fn main() {
    // 保存计数器的访问入口，后续代码使用它更新或观察计数。
    let counter = Arc::new(AtomicUsize::new(0));

    // 保存所有并发工作的句柄，后面逐个等待，避免遗漏后台任务。
    let mut jobs = Vec::new();
    for _ in 0..4 {
        // 保存计数器的访问入口，后续代码使用它更新或观察计数。
        let counter = Arc::clone(&counter);
        jobs.push(std::thread::spawn(move || {
            for _ in 0..100 {
                // 原子更新避免计数操作被其他线程交错覆盖。
                counter.fetch_add(1, Ordering::Relaxed);
            }
        }));
    }
    for job in jobs {
        // 等待线程结束后再读取最终结果。
        job.join().unwrap();
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(counter.load(Ordering::Relaxed), 400);
}
