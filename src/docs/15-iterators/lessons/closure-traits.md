---
id: closure-traits
title: 闭包如何捕获环境
subtitle: Fn、FnMut、FnOnce 描述调用时需要的能力。
minutes: 16
type: lesson
chapterId: iterators
order: 2
---

## Fn、FnMut、FnOnce 描述调用时需要的能力。

闭包由参数、函数体和捕获的环境组成。编译器根据函数体如何使用环境，选择共享借用、可变借用或移动捕获。`move` 强制按值捕获，不代表闭包只能调用一次；是否消耗捕获值，才决定它能否被反复调用。

FnOnce 允许调用时消费闭包，所有闭包至少可以作为 FnOnce 调用。FnMut 需要可变访问闭包，适合更新计数；Fn 只需共享访问。需要 Fn 的接口不能接受任意 FnMut，但需要 FnOnce 的接口可以接受满足更强能力的闭包。不要把它们当作三种互斥标签。

迭代器适配器通常延迟执行。map 中增加的计数要等消费时才变化，collect 的目标类型又决定最终集合。示例使用 for_each 展示 FnMut 捕获；调用结束后借用结束，外部才读取累计结果。

<CourseCallout>

移动捕获的是值；调用能力取决于函数体是否把它移出或修改。

</CourseCallout>

## 亲手试一试

```rust playground id=closure-traits source=15-iterators/src/bin/closure-traits.rs

```

<CourseCallout title="给自己一个小挑战">

把累计闭包保存为变量并调用两次，再比较移出 `String` 的闭包为何只能调用一次。

</CourseCallout>
