fn main() {
    // 保存当前计数，用于对比操作之前与之后的状态。
    let count = 3;

    // 复制整数值；整数实现 Copy，因此原绑定仍能使用。
    let another = count;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("整数：{count}，副本：{another}");

    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [1, 2, 3];
    println!("数组调试形式：{values:?}");

    // 从固定文本创建拥有存储的字符串，后续操作以这个值为输入。
    let text = String::from("你好");
    println!("{text}");
    println!("打印后还可使用：{text}");
    // String 没有 Copy；显式 clone 才得到独立副本。
    let mut copied = text.clone();
    copied.push('!');

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(text, "你好");
    assert_eq!(copied, "你好!");
}
