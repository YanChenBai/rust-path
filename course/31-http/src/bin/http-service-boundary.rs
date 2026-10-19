// 先判断方法再判断路径，分别表达 405、200 与 404 的业务含义。
fn route(method: &str, path: &str) -> (u16, String) {
    if method != "GET" {
        return (405, String::from("method not allowed"));
    }

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match path {
        "/health" => (200, String::from("ok")),
        _ => (404, String::from("not found")),
    }
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(route("GET", "/health"), (200, String::from("ok")));
    assert_eq!(route("POST", "/health").0, 405);
    assert_eq!(route("GET", "/missing").0, 404);
}
