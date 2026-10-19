// 输入与输出的生命周期标注描述借用关系，不延长数据的存活时间。

// 两个输入和返回值共享借用约束，返回其中一个原切片，不创建新文本。
fn longer<'a>(left: &'a str, right: &'a str) -> &'a str {
    if left.chars().count() >= right.chars().count() {
        left
    } else {
        right
    }
}

fn main() {
    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let name = String::from("你好");

    // 保存第二个候选文本，供生命周期示例比较两个输入。
    let other = String::from("Rust");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(longer(&name, &other), "Rust");
    assert_eq!(longer("甲乙", "ab"), "甲乙");
}
