---
id: errors-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 重试三次
  - 转换为成功
  - 从当前函数提前返回错误
  - 打印并继续
type: question
chapterId: errors
order: 2
assessment:
  answer: 从当前函数提前返回错误
  explanation: 错误传播不等于处理。
  mode: fold
---

? 在 `Err` 时主要做什么？
