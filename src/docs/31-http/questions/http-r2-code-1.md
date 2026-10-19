---
id: http-r2-code-1
kind: code
title: 健康检查路由
type: question
chapterId: http
order: 6
---

实现 route(method: `&str`, path: `&str`) -&gt; (`u16`,`String`)，非 GET 返回 (405,"method")，GET /health 返回 (200,"ok")，其他路径 (404,"missing")。

```rust starter
fn route(method: &str, path: &str) -> (u16, String) {
    todo!()
}

fn main() {
    // 先完成上方函数，再提交边界测试。
}
```
