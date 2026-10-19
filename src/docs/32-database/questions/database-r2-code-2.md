---
id: database-r2-code-2
kind: code
title: 空表总时长
type: question
chapterId: database
order: 7
---

实现 total_minutes(db: &`rusqlite::Connection`) -&gt; `rusqlite::Result`&lt;`i64`&gt;，对已存在 logs(minutes INTEGER NOT NULL) 表求和，空表为 0。

```rust starter
fn total_minutes(db: &rusqlite::Connection) -> rusqlite::Result<i64> {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
