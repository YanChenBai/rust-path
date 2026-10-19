fn main() {
    // 先保存带空白的原始文本，后续要按阶段清理和解析。
    let text = " 25 ";
    // 右侧读取旧 text；随后同名的新绑定保存清理后的文本。
    let text = text.trim();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("清理后：{text}");

    // 类型标注告诉 parse，要把文本解析成 u32。
    let text: u32 = text.parse().expect("固定示例是合法整数");
    {
        // 只在内部作用域创建增加奖励后的同名值；退出后外层仍是 25。
        let text = text + 5;

        // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
        assert_eq!(text, 30);
    }
    assert_eq!(text, 25);

    // 保存当前计数，用于对比操作之前与之后的状态。
    let mut count = 1;
    count = count + 1;
    assert_eq!(count, 2);
}
