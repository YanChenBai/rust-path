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
