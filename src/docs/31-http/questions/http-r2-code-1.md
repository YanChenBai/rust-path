---
id: http-r2-code-1
kind: code
title: 健康检查路由
type: question
chapterId: http
order: 6
assessment:
  explanation: '实现 route(method: &str, path: &str) -> (u16,String)，非 GET 返回 (405,"method")，GET /health 返回 (200,"ok")，其他路径 (404,"missing")。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 31-http/src/bin/http-r2-code-1.rs?region=answer
  testsSource: 31-http/src/bin/http-r2-code-1.rs?region=tests
---

实现 `route(method: &str, path: &str) -> (u16,String)`，非 GET 返回 (405,"method")，GET /health 返回 (200,"ok")，其他路径 (404,"missing")。

```rust starter source=31-http/starters/http-r2-code-1-starter.rs

```
