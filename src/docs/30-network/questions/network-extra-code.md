---
id: network-extra-code
kind: code
title: 解析简化 HTTP 状态行
type: question
chapterId: network
order: 7
assessment:
  explanation: 这是一份明确约定的简化状态行解析器，不是完整 HTTP 校验器。先限定首行与版本，再验证恰好三个 ASCII 数字和状态码范围；纯函数无网络等待问题。
  answerSource: 30-network/src/bin/network-extra-code.rs?region=answer
  testsSource: 30-network/src/bin/network-extra-code.rs?region=tests
---

实现 `status_code(response: &str) -> Option<u16>`，仅解析 lines().next() 首行，不连接服务器。首行用 split_ascii_whitespace 分词：版本必须是 HTTP/1.0 或 HTTP/1.1；第二词必须恰好 3 个 ASCII 数字且数值 100..=599；原因短语可缺省，后续词与行忽略。空串、首行空白、版本或状态码非法均返回 `None`。

```rust starter source=30-network/starters/network-extra-code-starter.rs

```
