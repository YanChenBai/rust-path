---
id: types-methods
title: 常用方法：返回新值还是修改原值
subtitle: 方法不是所有类型共享的一套命令
minutes: 18
type: lesson
chapterId: variables
order: 5
---

## 先确认值的类型，再查方法的参数、返回值和访问方式。

整数有 abs、pow、checked_add 等数值操作，但没有通用 `len`；数组、切片、字符串和 `Vec` 等集合才有各自的长度接口。即使名称一样，含义也要看类型：字符串 `len` 是字节数，数组 `len` 是元素个数。不能只记方法名字就推断它对所有值做相同的事。

text.trim() 返回去掉外侧空白后的借用文本，不修改原 text。text.to_uppercase() 返回新 `String`，也不原地改大写。相反，`String` 的 push、push_str、clear 需要可变访问并修改原值。对不修改的方法加 `mut` 没有必要，对真正修改的方法则要有可变绑定。观察返回值是否被使用，是理解示例的重要步骤。

标准库文档签名中的 &self 通常表示只读访问，`&mut self` 表示需要可变访问，self 表示按值接收，可能消费原值。暂时不熟悉引用符号时，先用本节对照例子建立直觉，后面的借用章节会解释限制。悬浮提示和类型检查能帮助确认类型，但教程仍应先说明为何选择这个接口，而不是要求你猜方法。

<CourseCallout>

trim 不原地清理，to_uppercase 不原地大写；push_str 才会改变可变 `String`。

</CourseCallout>

## 亲手试一试

```rust playground id=types-methods source=02-variables/src/bin/types-methods.rs

```

<CourseCallout title="给自己一个小挑战">

删掉保存 trim 返回值的那行，观察原文本是否改变；再对数字调用 `len`，读诊断。

</CourseCallout>
