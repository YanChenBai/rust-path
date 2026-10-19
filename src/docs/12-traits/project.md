---
type: project
chapterId: traits
id: traits-project
title: 带校验的时长类型
---

组合领域类型、转换契约和错误返回。

## 验收要求

- 定义 #[derive(`Debug`,PartialEq)] `struct` Minutes(`u32`)
- 实现 TryFrom&lt;`u32`&gt;，错误类型 `String`，只接受 1..=180，失败返回 range
- 实现 From&lt;Minutes&gt; `for` `u32`，消费包装并返回数值

```rust starter
#[derive(Debug, PartialEq)]
struct Minutes(u32);
fn main() {}
```
