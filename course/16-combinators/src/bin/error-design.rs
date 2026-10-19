// 把“没有设置”和“有设置但解析失败”保留为两种不同结果。
fn setting(input: Option<&str>) -> Result<Option<u32>, std::num::ParseIntError> {
    input.map(str::parse::<u32>).transpose()
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(setting(None).unwrap(), None);
    assert_eq!(setting(Some("0")).unwrap(), Some(0));
    assert!(setting(Some("bad")).is_err());
}
