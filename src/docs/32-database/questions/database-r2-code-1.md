---
id: database-r2-code-1
kind: code
title: 安全插入名称
type: question
chapterId: database
order: 6
---

实现 insert_name(db: &`rusqlite::Connection`, name: `&str`) -&gt; `rusqlite::Result`&lt;`usize`&gt;，参数化写入已存在的 names(value TEXT NOT NULL) 表。

```rust starter
fn insert_name(db: &rusqlite::Connection, name: &str) -> rusqlite::Result<usize> {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
