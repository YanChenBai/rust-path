---
id: io-extra-code
kind: code
title: 统计配置中的有效行
type: question
chapterId: io
order: 7
assessment:
  explanation: 通过 BufRead 泛型同时支持文件和内存输入。逐行读取时先传播 I/O 错误，再清理和筛选文本；错误不能被当作空行跳过。
  answerSource: 21-io/src/bin/io-extra-code.rs?region=answer
  testsSource: 21-io/src/bin/io-extra-code.rs?region=tests
---

实现 `count_records<R: std::io::BufRead>(reader: R) -> std::io::Result<usize>`。逐行 trim 后，忽略空行和以 # 开头的整行注释，其余每行计 1；行内 # 不特殊处理。读取错误用 ? 原样传播，不访问真实文件。

```rust starter source=21-io/starters/io-extra-code-starter.rs

```
