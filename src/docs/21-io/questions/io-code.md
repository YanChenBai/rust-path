---
id: io-code
kind: code
title: 实现与边界
type: question
chapterId: io
order: 6
assessment:
  explanation: 泛型 BufRead 让同一逻辑同时支持文件与内存，并传播读取、解析、溢出错误。
  answerSource: 21-io/src/bin/io-code.rs?region=answer
  testsSource: 21-io/src/bin/io-code.rs?region=tests
---

实现 `sum_lines<R: std::io::BufRead>(reader: R) -> Result<i64, String>`：逐行 trim，忽略空行，解析并 checked_add，读取、解析或溢出均返回 `Err`。

```rust starter source=21-io/starters/io-code-starter.rs

```
