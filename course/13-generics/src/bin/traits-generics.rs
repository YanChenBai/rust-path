// 只读取切片并返回借用，因此不要求元素实现 Copy 或 Clone。

// 借用输入切片，最大元素仍由原集合拥有；空切片用 None 表达。
fn greatest<T: Ord>(items: &[T]) -> Option<&T> {
    items.iter().max()
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(greatest(&[2, 8, 3]), Some(&8));

    // 保存拥有文本的集合，验证接口并不要求元素都是 Copy。
    let names = [String::from("Ada"), String::from("Lin")];
    assert_eq!(greatest(&names).map(String::as_str), Some("Lin"));
    assert!(greatest::<i32>(&[]).is_none());
}
