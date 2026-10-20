---
id: traits-dyn
title: Trait 对象与接口设计
subtitle: 异构集合需要统一的行为视图
minutes: 18
type: lesson
chapterId: dyn
order: 0
advanced: true
---

## 用 dyn 隐藏具体类型，用借用或 Box 表达所有权。

泛型参数在一次具体调用中通常对应一个确定类型。如果希望把不同类型放进同一个列表，可以把它们转换成同一个 `trait` 对象视图。&dyn Label 借用对象，Box&lt;dyn Label&gt; 则拥有对象；`trait` 对象指针携带数据位置和分发所需的元数据，方法调用通过虚表选择具体实现，不需要在调用处知道真实类型。

能够作为 `trait` 对象使用的 `trait` 必须满足 dyn 兼容规则。常见障碍包括需要返回裸 Self 的方法、带类型参数的方法，以及要求 Self: Sized 的接口。可以把只适用于具体类型的方法加上 where Self: Sized，让其不参与对象调用；也可以拆分接口，把对象安全的读取行为与构造行为分别定义。

静态分发并非永远优于动态分发。插件列表、界面组件或任务处理器可能更重视异构组合和编译边界。反过来，如果调用点类型固定，泛型可以保留具体类型信息。示例把借用限制在 `main` 中，避免误以为所有 `trait` 对象都必须拥有 'static 数据。若把借用对象装进 Box，通常还需要显式写出对象生命周期边界。

<CourseCallout>

默认方法可复用行为，但 `trait` 不提供共享字段存储。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

增加第三个 Label 实现，分别使用 &dyn Label 和 Box&lt;dyn Label&gt; 组成集合。

</CourseCallout>

```rust playground id=traits-dyn source=18-dyn/src/bin/traits-dyn.rs

```
