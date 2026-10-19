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

`enum` 定义一组不同变体，每个变体可以携带自己的数据。`Option<T>` 用 `Some(value)` 表示存在，`None` 表示缺失。使用 `match` 可以显式处理这两种情况。

<CourseCallout>

不要习惯性 unwrap；当值是 `None` 时它会 panic。优先通过 `match` 或 `if` `let` 处理缺失。

</CourseCallout>

<LessonGuides lesson-id="enum" />

## 亲手试一试

```rust playground id=enum source=09-enums/src/bin/enum.rs

```

<CourseCallout title="给自己一个小挑战">

将 next 改为 `None`，设计一个友好的完成提示。

</CourseCallout>
