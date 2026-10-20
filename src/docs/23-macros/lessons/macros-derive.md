---
id: macros-derive
title: derive 与三类过程宏
subtitle: 消费宏和实现宏不是同一项工作
minutes: 18
nativeRequired: true
type: lesson
chapterId: macros
order: 1
advanced: true
---

## 声明宏按规则展开，过程宏程序处理 token 流。

derive 是属性语法，常用于根据结构体或枚举生成 `trait` 实现。`Debug`、`Clone`、PartialEq 等由编译器提供内建派生；serde 的 Serialize、Deserialize 则来自依赖提供的自定义 derive。派生是否可用取决于字段类型满足生成实现需要的边界，不能因为外层写了 `Clone` 就让任意字段都可复制。

过程宏有自定义派生、属性式和函数式三种常见形态。自定义派生接收数据类型声明并追加实现，属性式过程宏可转换所标注的条目，函数式过程宏在调用位置接收 token 并返回 token。它们与 macro_rules 的模式替换实现方式不同；相似的感叹号调用语法并不能告诉你背后是哪种宏。

实现自定义过程宏需要独立的 proc-macro crate，并遵守导出限制，不能把过程宏定义和同 crate 的普通 `main` 调用伪装成一个完整例子。本课程的单文件运行器适合消费已有 derive，因此此处用内建派生给出完整可编译程序，后续用 serde 演示外部派生。若真正开发过程宏，需要额外建立工程结构并设计展开错误诊断；并不是看到重复代码就必须编写宏。

<CourseCallout>

派生 `Debug` 方便诊断，但输出格式通常不应作为稳定的持久化协议。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

删去 PartialEq 观察断言错误；再手写一个等价实现，体会派生生成的边界。

</CourseCallout>

```rust playground id=macros-derive source=23-macros/src/bin/macros-derive.rs

```
