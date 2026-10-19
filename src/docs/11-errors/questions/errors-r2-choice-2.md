---
id: errors-r2-choice-2
kind: choice
title: 判断边界行为
options:
  - 相同
  - 编译时相同
  - 只对 u32 相同
  - 不同
type: question
chapterId: errors
order: 1
assessment:
  answer: 不同
  explanation: 缺失不是零。
  mode: fold
---

`Option` 的 `None` 与 `Some(0)` 相同吗？
