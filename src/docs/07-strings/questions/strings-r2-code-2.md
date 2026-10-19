---
id: strings-r2-code-2
kind: code
title: 取前几个字符
type: question
chapterId: strings
order: 7
assessment:
  explanation: '实现 prefix(text: &str, count: usize) -> String，取前 count 个 Unicode 标量值；不足则全部返回。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 07-strings/src/bin/strings-r2-code-2.rs?region=answer
  testsSource: 07-strings/src/bin/strings-r2-code-2.rs?region=tests
---

实现 `prefix(text: &str, count: usize) -> String`，取前 count 个 Unicode 标量值；不足则全部返回。

```rust starter source=07-strings/starters/strings-r2-code-2-starter.rs

```
