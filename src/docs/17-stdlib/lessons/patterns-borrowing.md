---
id: patterns-borrowing
title: 匹配借用与提取所有权
subtitle: 先决定保留原容器，还是消费其中的数据。
minutes: 16
type: lesson
chapterId: stdlib
order: 1
---

## 先决定保留原容器，还是消费其中的数据。

`match` owned_option 可能移出里面的 `String`，后续便不能把原容器当作完整值使用。`match` &owned_option 通过借用观察数据，可以在分支之后继续使用原容器。模式语法很简洁，但不会消除所有权规则。

枚举变体嵌套结构体时，可以只绑定需要的字段，使用 .. 忽略其余字段。需要保留容器却取走内部值时，`Option::take` 用 `None` 替换原值并返回原有 `Option`。这是一种明确的状态转换，不是越过借用检查搬走任意字段。

Rust Edition 会影响部分匹配绑定的语法细节，因此先使用与当前 Edition 2024 相符的借用匹配写法，不依赖旧教程中随意叠加 ref 的习惯。示例观察与提取分开：先借用读取，再 take 改变容器，最后检查容器确实变成 `None`。

<CourseCallout>

借用查看与取走内容是两个不同操作，接口应表达这种区别。

</CourseCallout>

## 亲手试一试

```rust playground id=patterns-borrowing
fn main() {
    // 保存当前步骤得到的值，后续通过接口检查或转换。
    let mut value = Some(String::from("Rust"));

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match &value {
        Some(text) => assert_eq!(text, "Rust"),
        None => panic!("固定示例有值"),
    }
    // 用合法替代状态换出原数据，而不是从借用中直接移出。
    let taken = value.take();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(taken.as_deref(), Some("Rust"));
    assert!(value.is_none());
}
```

<CourseCallout title="给自己一个小挑战">

增加空 `Option` 测试，确认 take 返回 `None` 且不会 panic。

</CourseCallout>
