---
type: project
chapterId: iterators
id: iterators-project
title: 日志数据流水线
assessment:
  explanation: 把解析、筛选、稳定排序和截取组合起来。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 15-iterators/src/bin/iterators-project.rs?region=answer
  testsSource: 15-iterators/src/bin/iterators-project.rs?region=tests
---

把解析、筛选、稳定排序和截取组合起来。

## 验收要求

- 实现 `top_minutes(input: &str, limit: usize) -> Vec<u32>`
- 逐行 trim 并解析 `u32`，忽略非法行和 0；按数值降序排列，保留重复值
- 最多返回 limit 条，limit=0 返回空

```rust starter source=15-iterators/starters/iterators-project-starter.rs

```
