---
id: result
title: Result 与问号运算符
subtitle: 把失败当作返回值的一部分
minutes: 8
type: lesson
chapterId: errors
order: 1
---

## 预料之内的失败，值得认真处理。

`Result`&lt;T, E&gt; 用 `Ok`(T) 表示成功，`Err`(E) 表示失败。? 在成功时取出值，在失败时提前返回错误。使用 ? 的函数必须返回兼容的 `Result`、`Option` 或其他支持的类型。

<CourseCallout>

`panic!` 适合不可恢复的程序错误；用户输入错误通常应该返回 `Result`。

</CourseCallout>

<LessonGuides lesson-id="result" />

## 亲手试一试

```rust playground id=result
fn parse_minutes(input: &str) -> Result<u32, std::num::ParseIntError> {
    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = input.parse::<u32>()?;
    Ok(minutes)
}

fn main() {
    // Result 把失败写进返回类型，调用者必须处理成功与错误。

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match parse_minutes("25") {
        Ok(n) => println!("计划学习 {n} 分钟"),
        Err(e) => println!("输入有误：{e}"),
    }
}
```

<CourseCallout title="给自己一个小挑战">

把输入改为 abc，观察错误如何被传递而不是让程序崩溃。

</CourseCallout>
