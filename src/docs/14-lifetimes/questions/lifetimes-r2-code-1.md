---
id: lifetimes-r2-code-1
kind: code
title: 借用前半段
type: question
chapterId: lifetimes
order: 6
assessment:
  explanation: '实现 before_space(text: &str) -> &str，返回第一个 ASCII 空格之前的原切片，无空格返回全部。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 14-lifetimes/src/bin/lifetimes-r2-code-1.rs?region=answer
  testsSource: 14-lifetimes/src/bin/lifetimes-r2-code-1.rs?region=tests
---

实现 `before_space(text: &str) -> &str`，返回第一个 ASCII 空格之前的原切片，无空格返回全部。

```rust starter source=14-lifetimes/starters/lifetimes-r2-code-1-starter.rs

```
