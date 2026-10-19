---
id: ownership-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 永远借用
  - 没有类型
  - 自动装箱
  - 实现 Copy
type: question
chapterId: ownership
order: 1
assessment:
  answer: 实现 Copy
  explanation: Copy 允许隐式复制。
  mode: fold
---

`i32` 赋值后通常还能使用原值，是因为什么？
