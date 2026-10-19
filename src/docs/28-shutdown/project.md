---
type: project
chapterId: shutdown
id: shutdown-project
title: 可关闭的数据处理管道
---

组合异步通道、类型转换和顺序处理，建立完整退出边界。

## 验收要求

- 实现 `async` `fn` pipeline(values: `Vec`&lt;`u32`&gt;) -&gt; `Vec`&lt;`u64`&gt;
- 用有界通道把输入发送给独立任务，逐项扩大为 `u64` 后乘 2
- 保持输入顺序；关闭发送端，等待处理任务；空输入能正常退出

```rust starter
async fn pipeline(values: Vec<u32>) -> Vec<u64> {
    todo!()
}
fn main() {}
```
