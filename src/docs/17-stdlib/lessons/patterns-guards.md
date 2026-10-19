---
id: patterns-guards
title: 解构、绑定与守卫
subtitle: 模式描述结构，守卫再判断运行时条件。
minutes: 16
type: lesson
chapterId: stdlib
order: 0
---

## 模式描述结构，守卫再判断运行时条件。

模式可以出现在 `match`、`let`、函数参数和 `for` 中。结构体、元组与枚举解构把嵌套数据展开为名字，_ 忽略值，而以 _ 开头的变量仍会绑定并可能移动值，两者并不相同。匹配引用时还要判断绑定取得的是借用还是拥有值。

范围模式适合固定区间，守卫 `if` 适合依赖运行时数据的条件。@ 可以在限制内部模式的同时绑定整个匹配值。带守卫的分支不自动证明穷尽所有输入，因此还需要覆盖其他情况。顺序很重要：宽泛分支写在前面会遮住后面的更具体分支。

`let` `else` 让成功路径保持平坦，但 `else` 分支必须发散，例如 `return`、break 或 panic，不能随意回到同一个控制流。示例把缺失、范围内和范围外分开处理；练习不要仅靠 _ 将错误和正常的边界混成同一含义。

<CourseCallout>

_ 不绑定，_name 仍是绑定；忽略的写法会影响所有权。

</CourseCallout>

## 亲手试一试

```rust playground id=patterns-guards
fn label(value: Option<u32>) -> String {
    let Some(n) = value else {
        return String::from("missing");
    };

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match n {
        value @ 1..=180 => format!("valid:{value}"),
        0 => String::from("zero"),
        _ => String::from("range"),
    }
}

fn main() {
    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(label(Some(25)), "valid:25");
    assert_eq!(label(None), "missing");
    assert_eq!(label(Some(0)), "zero");
}
```

<CourseCallout title="给自己一个小挑战">

把范围守卫改为范围模式，再尝试给守卫增加运行时阈值。

</CourseCallout>
