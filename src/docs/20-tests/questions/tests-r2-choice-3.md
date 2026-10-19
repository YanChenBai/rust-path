---
id: tests-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 编译更快
  - 没有影响
  - 互相覆盖、结果不稳定
  - 自动串行
type: question
chapterId: tests
order: 2
assessment:
  answer: 互相覆盖、结果不稳定
  explanation: 测试应隔离资源与副作用。
  mode: fold
---

并行测试共享固定临时文件名可能导致什么？
