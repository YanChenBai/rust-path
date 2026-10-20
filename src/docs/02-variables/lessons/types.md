---
id: types
title: 元组与数组：组合多个值
subtitle: 把单个值组合成有明确形状的数据
minutes: 8
type: lesson
chapterId: variables
order: 2
---

## 类型，是数据与程序之间的约定。

元组可以按位置组合不同类型，例如 (姓名, 分钟, 是否完成)，用 .0、.1、.2 读取对应位置，也可以用 `let (name, minutes, done) = record` 解构。数组 [T; N] 的元素类型相同且长度固定，使用 [10, 20, 30] 创建，下标从 0 开始。元组表达几个不同含义的值，数组表达一组同类值，不要只因为都能装多个值就混为一谈。

<CourseCallout>

数组 `len()` 返回元素数量，不是最后一个下标；三个元素的合法下标是 0、1、2。

</CourseCallout>

<LessonGuides lesson-id="types" />

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

修改元组的姓名和数组内容，预测 .1、[1] 与 `len()` 各自得到什么。

</CourseCallout>

```rust playground id=types source=02-variables/src/bin/types.rs

```
