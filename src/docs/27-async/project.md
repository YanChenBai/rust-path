---
type: project
chapterId: async
id: async-project
title: 可取消任务竞速
assessment:
  explanation: 取消分支用 ready 和 biased 确定优先级，不靠睡眠猜调度；显式 abort 并等待后台任务。
  answerSource: 27-async/src/bin/async-project.rs?region=answer
  testsSource: 27-async/src/bin/async-project.rs?region=tests
---

混合 oneshot、spawn、select!、确定性优先级与任务回收。

## 验收要求

- 实现 `async fn race_or_cancel(cancel: bool) -> Result<u32, &'static str>`
- 创建 `oneshot<u32>`，后台任务持有 sender 后永久 pending；select 使用 biased，cancel 为真时 ready 分支优先返回 `Err("cancelled")`
- 否则在 receiver 与 yield_now 后返回 7 的分支之间选择，正常结果 `Ok(7)`；退出前 abort 后台任务并 `await` 确认取消，不使用 sleep 猜测调度

```rust starter source=27-async/starters/async-project-starter.rs

```
