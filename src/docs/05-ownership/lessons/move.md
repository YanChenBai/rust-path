---
id: move
title: 所有权与移动
subtitle: 每个值，都有自己的主人
minutes: 8
type: lesson
chapterId: ownership
order: 0
---

## 内存安全，从明确归属开始。

每个值都有一个所有者；所有者离开作用域时，值会被释放。`String` 的赋值通常转移所有权，原绑定随后不可用。`i32` 等实现 `Copy` 的类型则会按值复制。需要独立的堆数据时，显式调用 `clone`。

<CourseCallout>

`clone` 可能分配内存，不要仅为消除报错而到处复制。先考虑是否只需要借用。

</CourseCallout>

<LessonGuides lesson-id="move" />

## 亲手试一试

```rust playground id=move
fn main() {
    // String 按值赋值会转移所有权，原绑定随后不能继续使用。

    // 创建拥有文本的 String，用来观察赋值后谁负责管理它。
    let name = String::from("探索者");

    // clone 创建独立文本，用于对照移动与复制的区别。
    let backup = name.clone();

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("原始名字：{name}");
    println!("备份名字：{backup}");
}
```

<CourseCallout title="给自己一个小挑战">

把 `clone` 去掉，尝试同时输出两个名字，观察编译器如何解释移动。

</CourseCallout>
