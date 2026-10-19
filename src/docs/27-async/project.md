---
type: project
chapterId: async
id: async-project
title: 可取消任务竞速
---

混合 oneshot、spawn、select!、确定性优先级与任务回收。

## 验收要求

- 实现 `async` `fn` race_or_cancel(cancel: `bool`) -&gt; `Result`&lt;`u32`, &'static str&gt;
- 创建 oneshot&lt;`u32`&gt;，后台任务持有 sender 后永久 pending；select 使用 biased，cancel 为真时 ready 分支优先返回 `Err`("cancelled")
- 否则在 receiver 与 yield_now 后返回 7 的分支之间选择，正常结果 `Ok`(7)；退出前 abort 后台任务并 `await` 确认取消，不使用 sleep 猜测调度

```rust starter
async fn race_or_cancel(cancel: bool) -> Result<u32, &'static str> { todo!() }

fn main() {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    println!("{:?}", runtime.block_on(race_or_cancel(true)));
}
```
