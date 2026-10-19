---
type: project
chapterId: models
id: models-project
title: 学习记录领域对象
---

组合结构体、构造函数、借用方法和文本。

## 验收要求

- 定义 Session { name:`String`, minutes:`u32` }
- 实现 new(name:`String`)-&gt;Self，初始分钟为 0；add(&`mut` self,`u32`) 饱和累加
- 实现 summary(&self)-&gt;`String`，格式为 名字:分钟，查询不消费实例

```rust starter
struct Session {
    name: String,
    minutes: u32,
}
impl Session {
    // 实现 new、add、summary。
}
fn main() {}
```
