---
type: guide
lessonId: match
index: 1
title: 按结构拆开值，同时保留原数据
---

### 2. 按结构拆开值，同时保留原数据

这里匹配 &request，`Some` 中的 text 由模式匹配的自动引用绑定规则推断为 &`String`，因此只是借用文本。空白文本先被守卫拦下，其他 `Some` 走第二个分支，`None` 走第三个分支。匹配之后仍能打印 request。如果改为按值匹配并取出内部 `String`，就会发生移动，不能再把原来的 `Option` 当作完整值使用。

```rust runnable id=match-guide-1
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
```
