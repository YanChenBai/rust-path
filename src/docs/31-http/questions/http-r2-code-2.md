---
id: http-r2-code-2
kind: code
title: JSON 响应帧
type: question
chapterId: http
order: 7
assessment:
  explanation: '实现 json_response(body: &str) -> String，生成 HTTP/1.1 200 OK、Content-Type: application/json、Content-Length、Connection: close，使用 CRLF 和一个空行，随后原样 body。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。'
  answerSource: 31-http/src/bin/http-r2-code-2.rs?region=answer
  testsSource: 31-http/src/bin/http-r2-code-2.rs?region=tests
---

实现 `json_response(body: &str) -> String`，生成 HTTP/1.1 200 OK、Content-Type: application/json、Content-Length、Connection: close，使用 CRLF 和一个空行，随后原样 body。

```rust starter source=31-http/starters/http-r2-code-2-starter.rs

```
