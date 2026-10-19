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

```rust playground id=format source=01-start/src/bin/format.rs

```

<CourseCallout title="给自己一个小挑战">

修改学习目标，再添加一行注释解释你的目标。

</CourseCallout>
