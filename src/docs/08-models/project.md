---
type: project
chapterId: models
id: models-project
title: 学习记录领域对象
assessment:
  explanation: 组合结构体、构造函数、借用方法和文本。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 08-models/src/bin/models-project.rs?region=answer
  testsSource: 08-models/src/bin/models-project.rs?region=tests
---

组合结构体、构造函数、借用方法和文本。

## 验收要求

- 定义 `Session { name:String, minutes:u32 }`
- 实现 `new(name:String)->Self`，初始分钟为 0；`add(&mut self,u32)` 饱和累加
- 实现 `summary(&self)->String`，格式为 名字:分钟，查询不消费实例

```rust starter source=08-models/starters/models-project-starter.rs

```
