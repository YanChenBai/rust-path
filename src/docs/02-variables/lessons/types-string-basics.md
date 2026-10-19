---
id: types-string-basics
title: 文本字面量、&str 与 String
subtitle: 先会创建与使用文本，再深入所有权
minutes: 18
type: lesson
chapterId: variables
order: 3
---

## 双引号文本通常是 &str；String 是可以拥有并增长的文本容器。

`let name = "Ada";` 里的双引号创建字符串字面量，name 的类型可看作 `&str`，即一段现有文本的引用。`String` 则拥有可增长的 UTF-8 文本。先记住常见选择：固定文本可直接用双引号；需要逐步追加、组合并保存独立结果时，常用 `String`。更深的引用和所有权关系会在后面讲解。

`String::from("Ada")` 根据已有文本创建 `String`，`String::new()` 创建空 `String`，`format!("你好，{name}")` 按模板创建 `String`。这三个表达式返回值，不会自动打印。`println!` 才把内容显示到终端；它和 `format!` 看起来相似，但结果与用途不同。

修改拥有的字符串时通常需要 `let mut`，再用 push_str 追加一段文本或 push 追加一个 char。`String::len()` 与 `&str` 的 `len()` 都返回字节数，所以“你好”常见编码下为 6，而不是 2。这里先使用这些具体接口，后面的 UTF-8 专章再解释为什么不能按任意字节位置切字符串。

<CourseCallout>

`String::from` 会创建值；text.push_str 会修改已有值；`println!` 会输出。三者不要混为一谈。

</CourseCallout>

## 亲手试一试

```rust playground id=types-string-basics source=02-variables/src/bin/types-string-basics.rs

```

<CourseCallout title="给自己一个小挑战">

把 name 改为中文，用 push_str 和 push 各追加一次，并预测 `len` 的字节数。

</CourseCallout>
