---
id: format
title: 格式化输出与注释
subtitle: 让程序说得更清楚
minutes: 8
type: lesson
chapterId: start
order: 1
---

## 把变量放进一句话。

`println!` 可以用 {} 占位符插入值，也可以直接捕获变量名，例如 {name}。// 开头的内容是单行注释，不会被执行。注释适合解释为什么这样写。

<CourseCallout>

格式化字符串必须是字面量。占位符的数量应与传入的参数对应。

</CourseCallout>

<LessonGuides lesson-id="format" />

## 亲手试一试

```rust playground id=format
fn main() {
    // 先准备数据，再用占位符展示；格式化通常只借用这些值。

    // 保存本次示例使用的名称文本，后面用于构造输出或比较。
    let name = "Rust 探索者";

    // 记录学习目标的天数，供格式化输出读取。
    let days = 7;
    // 从小目标开始
    println!("你好，{name}！");
    println!("我的目标：连续学习 {} 天。", days);
}
```

<CourseCallout title="给自己一个小挑战">

修改学习目标，再添加一行注释解释你的目标。

</CourseCallout>
