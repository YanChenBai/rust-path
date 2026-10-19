---
id: dyn-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - Vec<Box<dyn Trait>>
  - Vec<T> 自动接收所有类型
  - Vec<impl Trait> 任意混合
  - 只能字符串
type: question
chapterId: dyn
order: 0
assessment:
  answer: Vec<Box<dyn Trait>>
  explanation: trait 对象统一行为接口。
  mode: fold
---

异构对象集合通常可使用什么？
