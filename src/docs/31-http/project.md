---
type: project
chapterId: http
id: http-project
title: 学习记录 JSON API 核心
assessment:
  explanation: 组合路由、序列化、校验与错误状态，独立于传输测试。 验收同时检查正常输入、边界输入和失败状态，不能只让示例输出看起来正确。
  answerSource: 31-http/src/bin/http-project.rs?region=answer
  testsSource: 31-http/src/bin/http-project.rs?region=tests
---

组合路由、序列化、校验与错误状态，独立于传输测试。

## 验收要求

- 实现 `api(method: &str, path: &str, body: &str) -> (u16,String)`
- GET /health -&gt; (200,"ok")；POST /minutes 解析 JSON {"minutes":整数}，仅接受 1..=180
- 合法返回 (201,"saved:N")；非法 JSON 或范围返回 (400,"invalid")；已知路径不支持方法返回 405，未知路径返回 404

```rust starter source=31-http/starters/http-project-starter.rs

```
