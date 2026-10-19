---
type: project
chapterId: collections
id: collections-project
title: 按首次出现顺序统计
---

组合文本、向量与查询，保持明确的展示顺序。

## 验收要求

- 实现 word_counts(input: `&str`) -&gt; `Vec`&lt;(`String`,`usize`)&gt;
- 按 split_whitespace 分词，大小写敏感，不清理标点
- 按词首次出现顺序输出，每词只出现一次，统计全部出现次数

```rust starter
fn word_counts(input: &str) -> Vec<(String, usize)> {
    todo!()
}
fn main() {}
```
