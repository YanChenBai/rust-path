---
id: blocks
title: 块表达式与作用域
subtitle: 理解一个值从哪里来
minutes: 8
type: lesson
chapterId: functions
order: 1
---

## 花括号，也能产生值。

一个代码块可以拥有自己的局部绑定，并通过尾表达式产生值。块中声明的变量只在这个作用域中有效。把计算放在局部作用域，有助于减少共享的可变状态。

<CourseCallout>

在外层使用块内局部变量会编译失败。编译器会帮助你发现作用域错误。

</CourseCallout>

<LessonGuides lesson-id="blocks" />

## 亲手试一试

```rust playground id=blocks
fn main() {
    // 没有分号的尾表达式决定块的返回值。

    // 保存基础数值，内层计算在它的基础上增加奖励。
    let base = 30;

    // 接收内部代码块的尾表达式结果。
    let boosted = {
        // 保存本次额外奖励，只在当前块作用域内可见。
        let bonus = 15;
        base + bonus
    };

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("最终积分：{boosted}");
}
```

<CourseCallout title="给自己一个小挑战">

给 boosted 增加一个上限，最高返回 100。

</CourseCallout>
