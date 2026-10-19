---
id: variables-choice
kind: choice
title: 允许重新赋值
options:
  - let count = 0;
  - 'const count: i32 = 0;'
  - let mut count = 0;
  - 'let count: u32 = 0;'
type: question
chapterId: variables
order: 0
assessment:
  answer: let mut count = 0;
  explanation: mut 使绑定可变，普通 let 创建不可变绑定。
  mode: fold
---

哪个声明允许随后执行 count += 1？
