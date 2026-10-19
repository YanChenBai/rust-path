---
id: hello
title: 你好，Rust
subtitle: 让想法变成第一行输出
minutes: 8
type: lesson
chapterId: start
order: 0
---

## 每一段旅程，都从 Hello 开始。

Rust 程序从 `main` 函数开始执行。`fn` 用来定义函数，花括号包裹函数体。`println!` 是一个宏，会将文本输出到终端，并在末尾换行。先运行下面的程序，看看代码如何变成真实的输出。

<CourseCallout>

注意 println 后面的感叹号：它表示这是宏调用。字符串要使用英文双引号，语句末尾使用分号。

</CourseCallout>

<LessonGuides lesson-id="hello" />

## 亲手试一试

```rust playground id=hello
fn main() {
    // main 是程序入口；两次宏调用会按顺序各输出一行。

    // 向终端输出这一行问候；println! 会在末尾自动换行。
    println!("你好，Rust！");
    println!("每一次尝试，都是进步。");
}
```

<CourseCallout title="给自己一个小挑战">

把问候语改成你的名字，运行属于你的第一个 Rust 程序。

</CourseCallout>
