---
id: lifetimes-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 不能移动
  - 必须全局变量
  - 不包含较短借用
  - 永不释放
type: question
chapterId: lifetimes
order: 2
assessment:
  answer: 不包含较短借用
  explanation: 类型约束与实际存活时长不同。
  mode: fold
---

拥有 `String` 的值满足 static 约束意味着什么？
