---
id: lifetimes-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 必须 Copy
  - 必须 static
  - 必须 Mutex
  - 表达字段借用的生命周期参数
type: question
chapterId: lifetimes
order: 1
assessment:
  answer: 表达字段借用的生命周期参数
  explanation: 字段引用需要合法的来源关系。
  mode: fold
---

含 `&str` 字段的结构体通常需要什么？
