fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [1, 2, 3, 4];

    // 累计本次处理结果，后续断言会检查最终数值。
    let total = std::thread::scope(|scope| {
        // 启动或保存左半段的计算，避免直接共用可变累计值。
        let left = scope.spawn(|| values[..2].iter().sum::<i32>());

        // 启动或保存右半段的计算，最终与左半段结果合并。
        let right = scope.spawn(|| values[2..].iter().sum::<i32>());

        // 等待并发工作结束，再读取它产生的结果或处理线程恐慌。
        left.join().unwrap() + right.join().unwrap()
    });

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(total, 10);
}
