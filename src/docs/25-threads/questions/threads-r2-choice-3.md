---
id: threads-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 仅线程会
  - 仅 String 会
  - 不会
  - 总会
type: question
chapterId: threads
order: 2
assessment:
  answer: 不会
  explanation: 移动引用不延长被引用对象的存活。
  mode: fold
---

`move` 捕获一个短引用会把它变成 static 吗？
