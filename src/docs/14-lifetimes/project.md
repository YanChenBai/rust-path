---
type: project
chapterId: lifetimes
id: lifetimes-project
title: 零复制日志检索
assessment:
  explanation: 借用原始日志，返回首条包含关键词的非空行。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 14-lifetimes/src/bin/lifetimes-project.rs?region=answer
  testsSource: 14-lifetimes/src/bin/lifetimes-project.rs?region=tests
---

借用原始日志，返回首条包含关键词的非空行。

## 验收要求

- 实现 `find_line<'a>(input: &'a str, needle: &str) -> Option<&'a str>`
- 返回 trim 后的原文本切片；跳过空行；找不到返回 `None`
- needle 为空时返回首条非空行；不得通过泄漏内存构造 static 引用

```rust starter source=14-lifetimes/starters/lifetimes-project-starter.rs

```
