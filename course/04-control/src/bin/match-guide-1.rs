fn describe(request: &Option<String>) -> &str {
    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match request {
        Some(text) if text.trim().is_empty() => "有文本，但内容为空白",
        Some(_) => "有可用内容",
        None => "没有提交",
    }
}

fn main() {
    // 收集请求头部字节，并通过上限检查控制内存使用。
    let request = Some(String::from("  "));

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(describe(&request), "有文本，但内容为空白");
    assert_eq!(describe(&None), "没有提交");

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{}：{request:?}", describe(&request));
}
