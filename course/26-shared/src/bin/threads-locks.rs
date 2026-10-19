use std::sync::{Arc, Mutex, RwLock};

fn require_send_sync<T: Send + Sync>() {}

fn main() {
    require_send_sync::<Arc<Mutex<u32>>>();

    // 保存计数器的访问入口，后续代码使用它更新或观察计数。
    let counter = Arc::new(Mutex::new(0u32));

    // 把共享数据的访问入口交给另一个使用者。
    let shared = Arc::clone(&counter);

    // 保存任务句柄，不能把启动任务误当作任务已经完成。
    let job = std::thread::spawn(move || {
        // 保存借用或锁守卫；其存活期间相应访问约束一直有效。
        let mut guard = shared.lock().expect("锁未中毒");
        *guard += 1;
    });

    // 等待线程结束后再读取最终结果。
    job.join().unwrap();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(*counter.lock().unwrap(), 1);

    // 保存共享标题，读写访问需要遵守所选同步原语的约束。
    let title = RwLock::new(String::from("draft"));
    {
        *title.write().unwrap() = "ready".into();
    }
    assert_eq!(title.read().unwrap().as_str(), "ready");
}
