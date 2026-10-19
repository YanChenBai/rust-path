---
id: cargo-first-run
title: 从源码到 Cargo 运行
subtitle: 先认识工具，再逐步理解源码细节
minutes: 10
type: lesson
chapterId: start
order: 2
---

## cargo check、cargo run 和 cargo test 分别回答不同的问题。

Cargo.toml 描述包名、Edition 与依赖，`src/main.rs` 是常见二进制程序入口。cargo check 主要做静态检查，cargo build 生成构建产物，cargo run 构建后运行，cargo test 运行测试。工具栏里的命令对应这些真实操作，检查成功不代表程序已经执行，也不证明业务结果正确。

第一次学习不要求同时掌握所有语法。本章示例中的 `fn main`、`println!` 和 `format!` 可以先作为已提供的骨架使用：改文字、预测输出，再执行观察。章节练习若提供 `String` 返回值或函数签名，暂时保留它们，只修改标注区域；函数、类型和所有权会在后面分别系统讲解。

遇到报错先看第一条有意义的诊断：文件和行列、错误描述、指出的表达式以及建议。先修复一个原因再重新检查，不要把后续连带错误当成互不相关的问题。浏览器回退只支持部分基础单文件能力，依赖、线程与网络课程需要连接本机 Cargo 服务。

<CourseCallout>

源码、编译结果与上次运行输出是不同状态；修改后需重新检查或运行。

</CourseCallout>

## 亲手试一试

```rust playground id=cargo-first-run source=01-start/src/bin/cargo-first-run.rs

```

<CourseCallout title="给自己一个小挑战">

先使用检查代码，再运行程序；把宏名故意拼错，观察没有执行时出现的诊断。

</CourseCallout>
