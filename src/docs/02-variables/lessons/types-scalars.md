---
id: types-scalars
title: 整数、浮点、布尔与字符
subtitle: 先读懂类型标注，再理解推断
minutes: 16
type: lesson
chapterId: variables
order: 1
---

## 类型决定一个值能表示什么，以及哪些操作有意义。

`let age: u32 = 18;` 中，age 是名称，冒号后的 `u32` 是类型，等号右侧是初始值。`i32` 是有符号 32 位整数，可以为负；`u32` 无符号，不能表示负数。`usize` 主要用于长度与索引，它的大小随目标平台变化。未标注的整数通常在上下文无法进一步确定时默认 `i32`，不是所有数字永远都是 `i32`。

`f64` 表示浮点数，适合近似的小数计算。整数 5 / 2 得到 2，浮点 5.0 / 2.0 得到 2.5。Rust 不会默默把任意整数与浮点混算，需要明确转换。浮点不精确表示所有十进制小数，金额等场景往往用最小货币单位的整数，并明确舍入与溢出策略。

`bool` 只有 true 与 false，`if` 不接受数字充当真假。char 使用单引号，表示一个 Unicode 标量值；字符串使用双引号，即使只有一个字也不等同 char。数组长度、索引、字节数与字符数也不是同一概念；下面先观察每种类型的合法值，超出范围的数字会在编译期或运行时被拒绝，而不是任意容纳。

<CourseCallout>

'你' 是 char，"你" 是文本；`u32` 的 u 表示 unsigned，`i32` 的 i 表示 signed integer。

</CourseCallout>

## 亲手试一试

```rust playground id=types-scalars source=02-variables/src/bin/types-scalars.rs

```

<CourseCallout title="给自己一个小挑战">

把 `u32` 的值改为 -1，读报错；再比较整数除法和浮点除法的结果。

</CourseCallout>
