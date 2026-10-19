---
id: if
title: 用 if 做出选择
subtitle: 在不同的条件下，走不同的路
minutes: 10
type: lesson
chapterId: control
order: 0
---

## 让程序，做出第一个决定。

`if` 后面必须是 `bool` 条件。条件成立时执行第一个代码块，否则执行 `else`。需要多个判断时可以用 `else` `if`。Rust 不会把数字自动当作真假值：应明确写出 score &gt; 0。

<CourseCallout>

`if` 也是表达式，可以赋值给变量。所有分支必须返回同一种类型，末尾的值不要加分号。

</CourseCallout>

<LessonGuides lesson-id="if" />

## 亲手试一试

```rust playground id=if
fn main() {
    // 只有满足条件的分支会执行；分支表达式需要返回兼容的类型。

    // 保存当前分数，接下来的条件据此选择分支。
    let score = 85;

    // 保存本次消息内容或分支选出的提示。
    let message = if score >= 90 {
        "太棒了，继续挑战！"
    } else if score >= 60 {
        "顺利通过，继续前进。"
    } else {
        "再试一次，你可以的。"
    };

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("得分：{score}");
    println!("{message}");
}
```

<CourseCallout title="给自己一个小挑战">

试着把 score 改成 59、60 和 90，观察边界条件会发生什么。

</CourseCallout>
