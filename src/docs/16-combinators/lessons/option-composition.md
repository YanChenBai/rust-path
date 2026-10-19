---
id: option-composition
title: map 与 and_then 的边界
subtitle: 转换内部值与连接可能失败的步骤，是不同操作。
minutes: 16
type: lesson
chapterId: combinators
order: 0
---

## 转换内部值与连接可能失败的步骤，是不同操作。

`Option::map` 接收 T 到 U 的转换，把 `Some`(T) 变成 `Some`(U)，`None` 直接保持缺失。若转换本身返回 `Option`&lt;U&gt;，map 会得到嵌套 `Option`&lt;`Option`&lt;U&gt;&gt;，and_then 则把两次可能缺失的步骤连接起来。`Result` 的同名方法遵循相似思路，但保留错误信息。

unwrap_or 的参数在调用前就求值，即使里面已有值也会构建默认值；unwrap_or_else 接收闭包，只有缺失时才计算。默认值昂贵或会产生副作用时，这个差别很重要。不要把 unwrap_or_else 当作隐藏异常的手段，先判断缺失是否真的允许回退。

as_ref 和 as_deref 让你借用容器内部的数据，避免消费原 `Option`&lt;`String`&gt;。示例先借用名称，再完成可选数字解析。每一步应有清楚的类型：输入 `Option`&lt;`&str`&gt;，解析后 `Option`&lt;`u32`&gt;，过滤后仍是 `Option`&lt;`u32`&gt;。

<CourseCallout>

and_then 连接返回 `Option` 的步骤；map 不会自动替你展开嵌套。

</CourseCallout>

## 亲手试一试

```rust playground id=option-composition
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
```

<CourseCallout title="给自己一个小挑战">

用 map 改写 and_then，查看返回类型多出的一层 `Option`。

</CourseCallout>
