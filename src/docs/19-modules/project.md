---
type: project
chapterId: modules
id: modules-project
title: 封装学习时长领域模型
assessment:
  explanation: 用模块与私有字段守住校验约束。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 19-modules/src/bin/modules-project.rs?region=answer
  testsSource: 19-modules/src/bin/modules-project.rs?region=tests
---

用模块与私有字段守住校验约束。

## 验收要求

- 定义 mod domain，公开 Minutes，内部字段私有
- `Minutes::new(u32) -> Option<Self>` 只接受 1..=180；`get(&self) -> u32` 返回值
- 实现 `pub fn parse(input: &str) -> Option<Minutes>`，trim 后解析并调用构造函数

```rust starter source=19-modules/starters/modules-project-starter.rs

```
