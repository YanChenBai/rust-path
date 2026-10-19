---
type: project
chapterId: tests
id: tests-project
title: 修复区间合并器
assessment:
  explanation: 从反例入手实现稳定、可验证的数据处理。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 20-tests/src/bin/tests-project.rs?region=answer
  testsSource: 20-tests/src/bin/tests-project.rs?region=tests
---

从反例入手实现稳定、可验证的数据处理。

## 验收要求

- 实现 `merge_ranges(mut ranges: Vec<(u32,u32)>) -> Vec<(u32,u32)>`
- 忽略左端大于右端的非法区间，按左端排序
- 闭区间重叠则合并；仅相邻不合并，不能对最大端点做溢出加法

```rust starter source=20-tests/starters/tests-project-starter.rs

```
