macro_rules! numbers {
    ($($value:expr),* $(,)?) => {{
        // 保存处理生成的输出，避免把中间结果与最终展示混在一起。
        let mut output = Vec::<i32>::new();
        $(output.push($value);)*
        output
    }};
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert!(numbers!().is_empty());

    // 记录闭包或表达式实际执行次数，用于验证执行时机。
    let mut calls = 0;

    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = numbers!(
        {
            calls += 1;
            4
        },
        2,
    );
    assert_eq!(result, vec![4, 2]);
    assert_eq!(calls, 1);
}
