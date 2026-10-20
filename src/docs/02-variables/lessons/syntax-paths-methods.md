---
id: syntax-paths-methods
title: ::、. 与 ! 分别是什么意思
subtitle: 从名字找到类型，从值调用方法
minutes: 16
type: lesson
chapterId: variables
order: 4
---

## :: 连接路径，. 访问已有值的字段或方法，! 表示宏调用。

`String::from("Rust")` 可以拆成三部分：`String` 是类型名，:: 表示从这个类型的关联命名空间继续找名字，from 是关联函数名。`String::new()` 同样通过类型调用构造函数。`std::string::String` 则是一条模块路径：标准库 std 中的 string 模块里的 `String` 类型。:: 不是复制、解引用或继承运算符。

有了 `let text = String::from("Rust");` 之后，`text.len()` 用点号在这个具体值上调用方法。括号里是额外参数，有的方法没有额外参数，所以仍写空括号。结构体字段也用点号，例如 record.minutes，不过访问字段没有调用括号。类型决定可用的方法；数字不能因为字符串有 `len` 就也调用 `len`。

`println!(...)`、`format!(...)`、`vec![...]` 的感叹号说明宏调用；普通函数和方法通常没有这个感叹号。另一个常见写法是 `value.parse::<u32>()`，其中 `::<u32>` 给泛型方法指定类型，并不是创建子模块。初学时可以先写 `let number: u32 = value.parse().expect("固定输入合法");`，用左侧标注说明目标类型。expect 在失败时会停止程序，不能当成用户输入校验。

<CourseCallout>

记法：从类型或模块找名字用 ::；对已经存在的值做操作通常用 .；宏调用名后有 !。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

对照 `String::new()` 与 text.is_empty()，指出每一处左侧是类型还是值。

</CourseCallout>

```rust playground id=syntax-paths-methods source=02-variables/src/bin/syntax-paths-methods.rs

```
