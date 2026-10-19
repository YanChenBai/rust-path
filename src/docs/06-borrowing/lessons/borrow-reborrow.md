---
id: borrow-reborrow
title: 借用结束与重新借用
subtitle: 引用的有效范围取决于实际使用，而不只是花括号。
minutes: 16
type: lesson
chapterId: borrowing
order: 1
---

## 引用的有效范围取决于实际使用，而不只是花括号。

共享引用 &T 允许读取，可变引用 `&mut T` 提供独占访问。判断冲突时，先找被访问的同一份数据，再标出引用最后一次使用的位置。只要共享引用后面还要使用，便不能在中间取得冲突的可变访问；这保护的是数据的一致性，不是禁止程序发生变化。

把 `&mut T` 传给接收 `&mut T` 的函数时，经常会产生更短的重新借用。调用返回后，原有可变引用可以继续使用。示例通过 &`mut` *counter 明确写出这个关系，先让辅助函数临时使用，再由调用者继续更新；如果保留子借用并让它稍后再次使用，父引用的冲突访问就会被拒绝。

不要为了消除报错就到处添加 `clone`。先考虑缩短引用使用范围、按阶段读取与修改，或者让函数返回拥有所有权的数据。修改练习时先预测哪一行报错，再读取编译器给出的借用起点和后续使用位置。

<CourseCallout>

非词法生命周期能缩短借用，但不会允许两个相互冲突的访问同时有效。

</CourseCallout>

## 亲手试一试

```rust playground id=borrow-reborrow source=06-borrowing/src/bin/borrow-reborrow.rs

```

<CourseCallout title="给自己一个小挑战">

把只读引用放到修改之前，并在修改之后再次打印它，观察编译诊断。

</CourseCallout>
