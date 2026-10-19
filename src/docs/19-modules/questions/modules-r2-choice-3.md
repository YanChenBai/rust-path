---
id: modules-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 任意依赖
  - 整个操作系统
  - 当前 crate
  - 当前函数
type: question
chapterId: modules
order: 2
assessment:
  answer: 当前 crate
  explanation: crate 内接口不必成为外部 API。
  mode: fold
---

`pub(crate)` 限制到哪里？
