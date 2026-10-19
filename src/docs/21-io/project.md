---
type: project
chapterId: io
id: io-project
title: 文件摘要器
assessment:
  explanation: 先完整读取再创建输出，显式 flush；练习限定两条独立的普通路径，不处理符号链接或硬链接别名。
  answerSource: 21-io/src/bin/io-project.rs?region=answer
  testsSource: 21-io/src/bin/io-project.rs?region=tests
---

组合 Path、文件缓冲读取、文本筛选、结果写入与错误传播。

## 验收要求

- 实现 `summarize_file(input: &std::path::Path, output: &std::path::Path) -> std::io::Result<usize>`
- 统计 trim 后非空行数，输出精确为 lines=N 加换行，覆盖已有输出并显式 flush
- 输入不存在需报错，输入输出路径文本相同需拒绝；输入输出限定无别名的普通文件

```rust starter source=21-io/starters/io-project-starter.rs

```
