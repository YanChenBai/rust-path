use std::sync::{Arc, Mutex};

fn main() {
    // 保存受保护的余额，检查与扣减应处于同一个临界区。
    let balance = Arc::new(Mutex::new(10u32));

    // 增加共享所有者的数量，不深复制内部业务数据。
    let copy = Arc::clone(&balance);

    // 保存工作线程或任务的句柄，稍后需要等待并检查完成结果。
    let worker = std::thread::spawn(move || {
        // 保存当前步骤得到的值，后续通过接口检查或转换。
        let mut value = copy.lock().expect("演示不触发中毒");
        // 检查与更新必须处于同一个临界区。
        if *value >= 7 {
            *value -= 7;
        }
    });

    // 等待并发工作结束，再读取它产生的结果或处理线程恐慌。
    worker.join().unwrap();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(*balance.lock().unwrap(), 3);
}
