---
id: models-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - '&self'
  - self 且必须销毁
  - '&mut self 才能读'
  - 全局变量
type: question
chapterId: models
order: 0
assessment:
  answer: '&self'
  explanation: 只读借用保留调用者所有权。
  mode: fold
---

只读取实例的方法通常接收什么？
