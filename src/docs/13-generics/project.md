---
type: project
chapterId: generics
id: generics-project
title: 通用稳定去重器
assessment:
  explanation: 把拥有权移动、集合遍历与泛型边界组合起来。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 13-generics/src/bin/generics-project.rs?region=answer
  testsSource: 13-generics/src/bin/generics-project.rs?region=tests
---

把拥有权移动、集合遍历与泛型边界组合起来。

## 验收要求

- 实现 `unique<T: PartialEq>(items: Vec<T>) -> Vec<T>`
- 保留首次出现的元素及其顺序，不要求 `Clone`、`Copy` 或 Hash
- 空输入返回空 `Vec`

```rust starter source=13-generics/starters/generics-project-starter.rs

```
