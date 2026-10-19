---
id: combinators-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - Result<T, Option<E>>
  - bool
  - Result<Option<T>, E>
  - Option<T>
type: question
chapterId: combinators
order: 2
assessment:
  answer: Result<Option<T>, E>
  explanation: transpose 交换两层容器。
  mode: fold
---

`Option<Result<T,E>>::transpose` 返回什么？
