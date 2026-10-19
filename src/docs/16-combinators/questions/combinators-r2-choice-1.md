---
id: combinators-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - 嵌套 Option
  - 自动变成 U
  - 总是 None
  - 编译器自动 unwrap
type: question
chapterId: combinators
order: 0
assessment:
  answer: 嵌套 Option
  explanation: map 不自动展开闭包结果。
  mode: fold
---

map 的闭包返回 `Option<U>` 时会得到什么？
