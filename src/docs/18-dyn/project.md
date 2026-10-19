---
type: project
chapterId: dyn
id: dyn-project
title: 可扩展报表渲染器
assessment:
  explanation: 把异构对象、借用、trait 与字符串拼接组合起来。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 18-dyn/src/bin/dyn-project.rs?region=answer
  testsSource: 18-dyn/src/bin/dyn-project.rs?region=tests
---

把异构对象、借用、`trait` 与字符串拼接组合起来。

## 验收要求

- 定义 `trait Render { fn render(&self) -> String; }`
- 定义 `Text(String)`、`Count(u32)`，实现 Render，分别返回原文本与十进制数字
- 实现 `report(items: &[&dyn Render]) -> String`，按顺序用换行连接，无额外尾换行

```rust starter source=18-dyn/starters/dyn-project-starter.rs

```
