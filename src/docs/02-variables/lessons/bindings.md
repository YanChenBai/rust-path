---
id: bindings
title: 变量与可变性
subtitle: 明确哪些数据可以改变
minutes: 8
type: lesson
chapterId: variables
order: 0
---

## 默认不可变，让变化更有意识。

`let` 创建变量绑定。Rust 的变量默认不可变，重新赋值会产生编译错误。加入 `mut` 就可以更新变量。相同名字的 `let` 会创建新绑定，这叫遮蔽，它甚至可以改变数据类型。

<CourseCallout>

`mut` 允许修改原绑定，但不能改变它的类型。遮蔽通过新的 `let` 创建新绑定。

</CourseCallout>

<LessonGuides lesson-id="bindings" />

## 亲手试一试

```rust playground id=bindings
fn main() {
    // mut 修改同一个绑定，遮蔽则创建一个新的同名绑定。

    let mut steps = 1;
    steps += 1;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("已走出 {steps} 步");
    let steps = "继续前进";
    println!("{steps}");
}
```

<CourseCallout title="给自己一个小挑战">

去掉 `mut` 并编译，读一读错误；然后修复它并把步数增加到 3。

</CourseCallout>
