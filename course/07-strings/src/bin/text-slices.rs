fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [10, 20, 30];

    // 借用原序列的一段连续元素，不复制数组内容。
    let middle: &[i32] = &values[1..3];

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(middle, &[20, 30]);

    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let text = String::from("你好");
    // 字节数与 Unicode 标量值数量不是一回事。
    assert_eq!(text.len(), 6);
    assert_eq!(text.chars().count(), 2);
    assert_eq!(text.get(0..3), Some("你"));
    assert_eq!(text.get(0..1), None);
}
