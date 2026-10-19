---
id: dyn-ownership
title: 借用接口与拥有接口
subtitle: dyn 隐藏具体类型，Box 决定是否拥有对象。
minutes: 16
type: lesson
chapterId: dyn
order: 1
---

## dyn 隐藏具体类型，Box 决定是否拥有对象。

泛型参数在一次调用中有确定的具体类型，因此 `Vec<T>` 不能直接装入任意不同类型。&dyn Trait 提供借用的共同接口，Box&lt;dyn Trait&gt; 拥有实现者，适合需要保存异构对象的场景。动态分发让调用通过运行时元数据找到实现，并不要求在每次调用时重新编译。

`trait` 必须满足 dyn 兼容要求。返回裸 Self、带类型参数的方法等会影响能否通过对象调用；只适用于具体类型的方法可以加 where Self: Sized。设计接口时先说明调用者需要哪些能力，不要把所有构造与内部操作都塞进同一个 `trait`。

Box&lt;dyn Trait&gt; 在常见类型位置默认有 'static 对象生命周期边界，包含借用的实现者可能需要显式写成 Box&lt;dyn Trait + 'a&gt;。这与 Box 自己何时析构不同。示例选择拥有 `String` 的对象，避免把这个额外约束混进第一次异构集合练习。

<CourseCallout>

动态分发、堆分配与共享所有权是三件事：dyn、Box、Arc 分别表达不同责任。

</CourseCallout>

## 亲手试一试

```rust playground id=dyn-ownership source=18-dyn/src/bin/dyn-ownership.rs

```

<CourseCallout title="给自己一个小挑战">

增加一个固定前缀实现，放入同一个对象集合。

</CourseCallout>
