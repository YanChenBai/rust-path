fn twice<F: FnMut()>(mut action: F) {
    action();
    action();
}

fn main() {
    // 记录闭包或表达式实际执行次数，用于验证执行时机。
    let mut calls = 0;
    twice(|| calls += 1);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(calls, 2);

    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let name = String::from("Rust");
    // move 拥有 name，但只借用它打印，因此闭包仍可反复调用。
    twice(move || println!("{name}"));
}
