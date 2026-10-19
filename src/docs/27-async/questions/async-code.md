---
id: async-code
kind: code
title: 实现与边界
type: question
chapterId: async
order: 6
---

实现 `async` `fn` doubled(values: `Vec`&lt;`u32`&gt;) -&gt; `Vec`&lt;`u64`&gt;：逐项 `tokio::spawn`，以 `u64` 加倍，等待全部任务并按输入顺序输出。空输入返回空列表。

```rust starter
async fn doubled(values: Vec<u32>) -> Vec<u64> { todo!() }

fn main() {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    println!("{:?}", runtime.block_on(doubled(vec![1,2])));
}
```
