---
id: stdlib-r2-choice-1
kind: choice
title: 理解关键机制
options:
  - 发散，不回到后续成功路径
  - 返回普通整数
  - 留空
  - 只打印日志
type: question
chapterId: stdlib
order: 0
assessment:
  answer: 发散，不回到后续成功路径
  explanation: return 等发散操作保证后续模式已匹配。
  mode: fold
---

```rust source=17-stdlib/snippets/stdlib-r2-choice-1-snippet-1.rs

```
