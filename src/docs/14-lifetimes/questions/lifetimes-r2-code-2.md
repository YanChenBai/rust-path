---
id: lifetimes-r2-code-2
kind: code
title: 两个来源的返回关系
type: question
chapterId: lifetimes
order: 7
assessment:
  explanation: "实现 choose<'a>(left: &'a str, right: &'a str, use_left: bool) -> &'a str，按布尔值返回原切片。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。"
  answerSource: 14-lifetimes/src/bin/lifetimes-r2-code-2.rs?region=answer
  testsSource: 14-lifetimes/src/bin/lifetimes-r2-code-2.rs?region=tests
---

实现 `choose<'a>(left: &'a str, right: &'a str, use_left: bool) -> &'a str`，按布尔值返回原切片。

```rust starter source=14-lifetimes/starters/lifetimes-r2-code-2-starter.rs

```
