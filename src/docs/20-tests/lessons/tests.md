---
id: tests
title: 为行为写测试
subtitle: 让每次修改都有底气
minutes: 8
type: lesson
chapterId: tests
order: 0
---

## 用一个断言，守住一个约定。

#[test] 标记测试函数，`assert_eq!` 比较实际值与预期值。测试应覆盖正常输入、边界和异常。实际项目使用 cargo test；下方示例通过主函数运行相同断言，章节编程题则使用真正的 Rust 测试程序判题。

<CourseCallout>

通过几个测试不代表程序绝对正确。尝试找出没有被覆盖的边界，例如空输入与溢出。

</CourseCallout>

<LessonGuides lesson-id="tests" />

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

增加一个断言，验证恰好 60 分钟时返回 1 小时。

</CourseCallout>

```rust playground id=tests source=20-tests/src/bin/tests.rs

```
