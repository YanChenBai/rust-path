---
id: iterators-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - 没有，等待消费
  - 全部执行
  - 后台线程执行
  - 自动生成 Vec
type: question
chapterId: iterators
order: 0
assessment:
  answer: 没有，等待消费
  explanation: 迭代适配器通常是惰性的。
  mode: fold
---

仅构建 map 迭代器时，闭包通常执行了吗？
