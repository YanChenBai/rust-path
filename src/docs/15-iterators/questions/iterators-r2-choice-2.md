---
id: iterators-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 一定
  - 不能调用
  - 必须异步
  - 不一定，取决于如何使用捕获值
type: question
chapterId: iterators
order: 1
assessment:
  answer: 不一定，取决于如何使用捕获值
  explanation: 捕获方式与调用能力不同。
  mode: fold
---

`move` 闭包一定只能调用一次吗？
