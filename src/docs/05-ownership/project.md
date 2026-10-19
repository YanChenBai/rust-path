---
type: project
chapterId: ownership
id: ownership-project
title: 拥有权报告封装
assessment:
  explanation: 练习明确的消费接口与独立副本。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 05-ownership/src/bin/ownership-project.rs?region=answer
  testsSource: 05-ownership/src/bin/ownership-project.rs?region=tests
---

练习明确的消费接口与独立副本。

## 验收要求

- 实现 `archive(text: String) -> (String,usize)`
- 返回拥有的原文本与其 UTF-8 字节数；`len` 为已提供标准库方法
- 不得丢失内容；空文本返回空 `String` 和 0

```rust starter source=05-ownership/starters/ownership-project-starter.rs

```
