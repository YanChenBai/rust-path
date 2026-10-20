---
id: macros-rules
title: macro_rules 的匹配与重复
subtitle: 宏生成语法，函数执行行为
minutes: 18
nativeRequired: true
type: lesson
chapterId: macros
order: 0
advanced: true
---

## 需要可变参数或生成代码结构时，再考虑宏。

macro_rules! 在编译期间匹配 token 模式并展开代码，不是运行时接收字符串的普通函数。$value:expr 捕获一个表达式，$(... ),* 表示逗号分隔的零次或多次重复，$(,)? 可以接受可选尾逗号。宏展开后仍必须通过正常的类型检查，所以匹配成功不代表任何类型组合都合法。

表达式宏通常展开为额外的一层块，让内部临时变量限制在独立作用域，并把块的尾表达式作为结果。示例把每个捕获表达式只放进一条 push 语句，避免输入有副作用时被重复求值。编写宏时必须明确求值次数、顺序、借用和移动语义，这些行为也是接口的一部分；不能只测试常量参数就宣称实现可靠。

声明宏具有混合式卫生规则，但这不代表所有名字都会自动正确解析。公开跨 crate 使用的宏引用自身 crate 的辅助项时，通常应考虑 $crate 路径；与标准库的冲突也可通过绝对路径减少。Rust 2024 的 expr 片段比旧 edition 接受更多表达式形式，需要兼容旧匹配范围时可查 expr_2021。本章不使用实验语法，空参数时仍需给容器明确元素类型。

<CourseCallout>

优先保留函数作为核心实现，让宏只负责难以用普通参数表达的调用语法。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

用带计数副作用的表达式调用宏，验证每个参数只执行一次，并验证空参数。

</CourseCallout>

```rust playground id=macros-rules source=23-macros/src/bin/macros-rules.rs

```
