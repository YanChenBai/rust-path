---
id: trait-contracts
title: 定义能力而不是继承字段
subtitle: trait 规定行为，实现为具体类型提供行为。
minutes: 16
type: lesson
chapterId: traits
order: 0
---

## trait 规定行为，实现为具体类型提供行为。

`trait` 声明一组方法签名，可以提供默认实现，但不会给实现者偷偷增加字段。结构体保存数据，`impl` Trait `for` Type 提供行为。为多个类型实现同一个接口后，调用者可以依据能力工作，而不是反复判断具体类型。

关联类型适合表达某个实现确定的一种输出，泛型参数适合让调用者选择类型。Default、`Debug`、PartialEq 是日常常用能力，可以手动实现，也可能通过 derive 生成。约束应来自算法真正需要的操作，不要随意叠加 `Clone` 或 static。

本节先通过具体类型直接调用方法，下一章再用泛型把这种能力传给通用算法。注意孤儿规则限制为外部类型实现外部 `trait`；需要自定义行为时，可以用本地 newtype 包装类型，而不是试图修改标准库的全局规则。

<CourseCallout>

先会定义和实现 `trait`，再学习泛型边界如何使用这些能力。

</CourseCallout>

## 亲手试一试

```rust playground id=trait-contracts source=12-traits/src/bin/trait-contracts.rs

```

<CourseCallout title="给自己一个小挑战">

为另一个结构体实现 Minutes，比较调用接口相同而内部数据不同的情况。

</CourseCallout>
