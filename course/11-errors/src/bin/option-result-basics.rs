fn main() {
    // 准备待处理的输入序列，后续会读取其中的元素并验证计算结果。
    let values = [0, 25];
    for index in [0, 1, 2] {
        // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
        match values.get(index) {
            Some(value) => println!("找到：{value}"),
            None => println!("没有这个位置"),
        }
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(values.get(0), Some(&0));
    assert_eq!(values.get(2), None);
}
