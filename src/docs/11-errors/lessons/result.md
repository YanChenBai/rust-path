---
id: result
title: Result 与问号运算符
subtitle: 把失败当作返回值的一部分
minutes: 8
type: lesson
chapterId: errors
order: 1
---

## 预料之内的失败，值得认真处理。

`Result<T, E>` 用 `Ok(T)` 表示成功，`Err(E)` 表示失败。? 在成功时取出值，在失败时提前返回错误。使用 ? 的函数必须返回兼容的 `Result`、`Option` 或其他支持的类型。

<CourseCallout>

`panic!` 适合不可恢复的程序错误；用户输入错误通常应该返回 `Result`。

</CourseCallout>

<LessonGuides lesson-id="result" />

## 亲手试一试

```rust playground id=result source=11-errors/src/bin/result.rs

```

<CourseCallout title="给自己一个小挑战">

把输入改为 abc，观察错误如何被传递而不是让程序崩溃。

</CourseCallout>
