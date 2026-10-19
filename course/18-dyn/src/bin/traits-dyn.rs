trait Label {
    fn label(&self) -> &str;
}

struct User(String);

impl Label for User {
    fn label(&self) -> &str {
        &self.0
    }
}

impl Label for u32 {
    fn label(&self) -> &str {
        "数字"
    }
}

fn main() {
    // 构造一个具体实现者，稍后通过统一接口访问。
    let user = User(String::from("小林"));

    // 保存当前计数，用于对比操作之前与之后的状态。
    let count = 3u32;

    // 通过同一个 trait 对象接口调用不同具体类型。
    let items: Vec<&dyn Label> = vec![&user, &count];

    // 收集每个对象给出的标签，便于验证动态分发结果。
    let labels: Vec<_> = items.iter().map(|item| item.label()).collect();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(labels, ["小林", "数字"]);
}
