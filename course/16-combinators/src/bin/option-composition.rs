// 把有效正数与非法输入区分开，避免把解析失败静默当成零。
fn positive(input: Option<&str>) -> Option<u32> {
    input.and_then(|text| text.parse().ok()).filter(|&n| n > 0)
}

fn main() {
    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let name = Some(String::from("Ada"));

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(name.as_deref(), Some("Ada"));
    assert_eq!(positive(Some("25")), Some(25));
    assert_eq!(positive(Some("bad")), None);
    assert_eq!(positive(None), None);
}
