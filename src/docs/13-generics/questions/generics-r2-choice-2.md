---
id: generics-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 总是要求
  - 要求 Copy
  - 要求 Default
  - 不要求
type: question
chapterId: generics
order: 1
assessment:
  answer: 不要求
  explanation: 借用不复制内部值。
  mode: fold
---

返回 &T 是否必然要求 `T: Clone`？
