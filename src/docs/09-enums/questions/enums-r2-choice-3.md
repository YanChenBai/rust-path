---
id: enums-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 复制整块堆内存
  - 强制释放
  - 借用内部字符串
  - 必定转移 String
type: question
chapterId: enums
order: 2
assessment:
  answer: 借用内部字符串
  explanation: 借用匹配可保留原值。
  mode: fold
---

匹配 &State 时通常如何访问其中的 `String`？
