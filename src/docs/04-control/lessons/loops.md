---
id: loops
title: 循环：for、while 与 loop
subtitle: 把重复交给代码
minutes: 8
type: lesson
chapterId: control
order: 1
---

## 一次编写，多次执行。

`for` 遍历迭代器，1..=5 包含 1 到 5，1..5 不包含 5。`while` 在条件成立时重复，`loop` 则持续循环，直到 break。continue 会跳过本轮剩余语句。break 还可以给 `loop` 返回一个值。

<CourseCallout>

优先使用 `for` 遍历集合或范围，减少下标越界与忘记更新条件的问题。

</CourseCallout>

<LessonGuides lesson-id="loops" />

## 亲手试一试

```rust playground id=loops source=04-control/src/bin/loops.rs

```

<CourseCallout title="给自己一个小挑战">

把范围改为 1..=10，只累加其中的偶数。

</CourseCallout>
