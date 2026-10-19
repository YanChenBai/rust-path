trait Render {
    fn render(&self) -> String;
}

struct Text(String);
impl Render for Text {
    fn render(&self) -> String {
        self.0.clone()
    }
}

struct Count(u32);
impl Render for Count {
    fn render(&self) -> String {
        self.0.to_string()
    }
}

fn main() {
    // 把输入组织成一个集合，后续以统一方式逐项读取。
    let items: Vec<Box<dyn Render>> =
        vec![Box::new(Text(String::from("Rust"))), Box::new(Count(3))];

    // 保存处理生成的输出，避免把中间结果与最终展示混在一起。
    let output: Vec<String> = items.iter().map(|item| item.render()).collect();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(output, ["Rust", "3"]);
}
