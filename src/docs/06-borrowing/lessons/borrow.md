---
id: borrow
title: 引用、可变借用与切片
subtitle: 使用数据，不必拿走它
minutes: 8
type: lesson
chapterId: borrowing
order: 0
---

## 借用，是暂时的使用权。

&T 创建共享引用，`&mut T` 创建可变引用。对于重叠的使用范围，允许多个共享引用，或一个独占的可变引用。`&str` 是字符串切片，&[T] 是集合切片，它们都借用已有数据。

<CourseCallout>

`String::len` 返回字节数。统计 Unicode 字符数量可以用 chars().count()；这仍不同于用户眼中的字形簇数量。

</CourseCallout>

<LessonGuides lesson-id="borrow" />

## 亲手试一试

```rust playground id=borrow source=06-borrowing/src/bin/borrow.rs

```

<CourseCallout title="给自己一个小挑战">

把名字改成中文，对比 `len()` 与 chars().count()。

</CourseCallout>
