---
id: bindings-shadowing
title: 同名 let：遮蔽与重新赋值
subtitle: 同一个名字，不一定是同一个绑定
minutes: 14
type: lesson
chapterId: variables
order: 6
---

## let text = … 再写一次，是创建新绑定；text = … 才是重新赋值。

`let text = " 25 "; let text = text.trim();` 不是语法错误，也不是对一个不可变变量强行赋值。每次 `let` 都创建一个新绑定，新的同名绑定遮住先前的名字，这叫遮蔽（shadowing）。第二行等号右侧先读取旧 text，得到结果之后，新 text 才开始代表新值。

重新赋值不写 `let`，例如 `let mut count = 1; count = 2;`。它更新的是同一个绑定，要求原绑定可变，而且类型必须一致。遮蔽则可以改变类型，例如先把输入保存为字符串，再解析成 `u32`。同名不意味着原变量的类型在运行中变了，而是名字现在指向另一个新绑定。

内层花括号还可以暂时遮住外层名字。离开内层作用域后，外层绑定重新可见。实际阅读时逐行记录“当前 text 是哪种类型、当前值是什么”，比把同名变量都看成一个会变类型的盒子更准确。使用 `mut` 表达持续更新状态，使用遮蔽表达清理、解析等处理阶段。

<CourseCallout>

`let text = text.trim()` 的右侧 text 指旧绑定，左侧创建新绑定。遮蔽无需 `mut`。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把第二个 `let` 改成普通赋值，观察类型和可变性错误；再比较内层作用域退出后的值。

</CourseCallout>

```rust playground id=bindings-shadowing source=02-variables/src/bin/bindings-shadowing.rs

```
