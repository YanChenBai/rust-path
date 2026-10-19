---
id: iterators-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 后者总反向
  - 没有区别
  - 借用遍历与按接收者语义取得元素
  - 前者总深复制
type: question
chapterId: iterators
order: 2
assessment:
  answer: 借用遍历与按接收者语义取得元素
  explanation: 拥有集合的 into_iter 通常移动元素。
  mode: fold
---

iter 与 into_iter 的主要区别是什么？
