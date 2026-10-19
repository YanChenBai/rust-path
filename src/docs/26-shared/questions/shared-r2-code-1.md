---
id: shared-r2-code-1
kind: code
title: 线程安全计数
type: question
chapterId: shared
order: 6
---

实现 concurrent_count(workers: `usize`, each: `usize`) -&gt; `usize`，每线程增加 each 次，共享 Arc&lt;Mutex&lt;`usize`&gt;&gt; 并等待全部线程；输入总数不溢出。

```rust starter
fn concurrent_count(workers: usize, each: usize) -> usize {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
