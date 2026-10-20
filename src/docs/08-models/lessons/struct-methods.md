---
id: struct-methods
title: 关联函数与方法接收者
subtitle: 构造入口、只读查询、修改操作应有清楚的签名。
minutes: 16
type: lesson
chapterId: models
order: 1
---

## 构造入口、只读查询、修改操作应有清楚的签名。

结构体给一组相关数据命名。`impl` 块组织与这个类型相关的行为，不是给每个字段增加一份函数副本。没有 self 的关联函数常用于构造，通过 `Type::new` 调用；有 self 的方法通过实例调用，接收者决定它借用还是消费当前值。

&self 适合只读查询，`&mut self` 适合修改状态，self 适合消费转换。使用借用接收者可以让调用者在之后继续使用对象。方法名不应该掩盖所有权变化，into_ 前缀常用于提醒“此转换会消费输入”，但真正的约束仍由签名决定。

示例计数器使用 saturating_add 明确溢出时保持上限，避免把构建模式差异当作业务规则。Default、Builder 和公开字段边界将在 `trait` 与模块章节继续解释；这里先让数据和更新规则通过一个实例关联起来。

<CourseCallout>

self、&self、`&mut self` 分别表达消费、共享读取和独占修改。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

增加 `reset(&mut self)`，并确认调用后仍能通过 get 读取。

</CourseCallout>

```rust playground id=struct-methods source=08-models/src/bin/struct-methods.rs

```
