---
type: project
chapterId: collections
id: collections-project
title: 按首次出现顺序统计
assessment:
  explanation: 组合文本、向量与查询，保持明确的展示顺序。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 10-collections/src/bin/collections-project.rs?region=answer
  testsSource: 10-collections/src/bin/collections-project.rs?region=tests
---

组合文本、向量与查询，保持明确的展示顺序。

## 验收要求

- 实现 `word_counts(input: &str) -> Vec<(String,usize)>`
- 按 split_whitespace 分词，大小写敏感，不清理标点
- 按词首次出现顺序输出，每词只出现一次，统计全部出现次数

```rust starter source=10-collections/starters/collections-project-starter.rs

```
