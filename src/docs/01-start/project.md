---
type: project
chapterId: start
id: start-project
title: 我的学习名片
assessment:
  explanation: format! 产生 String，不会打印到终端。
  answerSource: 01-start/src/bin/start-project.rs?region=answer
  testsSource: 01-start/src/bin/start-project.rs?region=tests
---

组合函数、字符串和格式化输出，生成你的第一张命令行名片。

## 验收要求

- 实现 `profile(name: &str, days: u32) -> String`
- 返回格式：名字 | Rust 第 N 天
- 支持中文名字和第 0 天

```rust starter source=01-start/starters/start-project-starter.rs

```
