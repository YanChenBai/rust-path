---
type: project
chapterId: errors
id: errors-project
title: 可靠的逐行导入
---

用显式匹配和错误传播组织全部成功或整体失败。

## 验收要求

- 实现 import_minutes(input:`&str`)-&gt;`Result`&lt;`Vec`&lt;`u32`&gt;,`String`&gt;
- 忽略空白行，每个非空行 trim 后必须为 1..=180
- 任一失败返回 `Err`，不返回部分数据；成功时按原顺序返回

```rust starter
fn import_minutes(input: &str) -> Result<Vec<u32>, String> {
    todo!()
}
fn main() {}
```
