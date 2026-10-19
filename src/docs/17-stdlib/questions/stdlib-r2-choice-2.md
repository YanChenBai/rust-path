---
id: stdlib-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 总会
  - 只对 String 会
  - 等同 _name
  - 不会
type: question
chapterId: stdlib
order: 1
assessment:
  answer: 不会
  explanation: _ 与 _name 的所有权语义不同。
  mode: fold
---

模式中的 _ 会绑定并保存值吗？
