---
id: enum
title: 枚举与 Option
subtitle: 让状态只保留合理的可能
minutes: 8
type: lesson
chapterId: enums
order: 0
---

## 用类型，描述不同的状态。

`enum` 定义一组不同变体，每个变体可以携带自己的数据。`Option`&lt;T&gt; 用 `Some`(value) 表示存在，`None` 表示缺失。使用 `match` 可以显式处理这两种情况。

<CourseCallout>

不要习惯性 unwrap；当值是 `None` 时它会 panic。优先通过 `match` 或 `if` `let` 处理缺失。

</CourseCallout>

<LessonGuides lesson-id="enum" />

## 亲手试一试

```rust playground id=enum
enum Status {
    Learning(u32),
    Completed,
}

fn main() {
    // 枚举用不同变体表达状态；match 分别处理每种情况。

    // 用枚举保存当前状态，避免用多个布尔值表达互斥情况。
    let status = Status::Learning(30);

    // 根据不同变体分别处理，不把缺失或错误偷偷当作正常值。
    match status {
        Status::Learning(xp) => println!("已积累 {xp} XP"),
        Status::Completed => println!("学习完成"),
    }

    // 构造带有数据的枚举变体，再通过模式匹配读取。
    let next = Some("集合");
    if let Some(title) = next {
        // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
        println!("下一站：{title}");
    }
}
```

<CourseCallout title="给自己一个小挑战">

将 next 改为 `None`，设计一个友好的完成提示。

</CourseCallout>
