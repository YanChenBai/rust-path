---
type: project
chapterId: ecosystem
id: ecosystem-project
title: 可诊断的学习记录 CLI
assessment:
  explanation: 混合 CLI、序列化、可匹配领域错误、应用上下文与 tracing 事件；未安装订阅者时事件通常不会显示。
  answerSource: 29-ecosystem/src/bin/ecosystem-project.rs?region=answer
  testsSource: 29-ecosystem/src/bin/ecosystem-project.rs?region=tests
---

整合 clap、serde、serde_json、thiserror、anyhow 与 tracing；HTTP 客户端已在本章独立验证。

## 验收要求

- 实现 `execute(args: &[&str]) -> anyhow::Result<String>`，通过 clap 接收必填 --json 字符串，首项为程序名
- `Record { name: String, minutes: u32 }` 派生 JSON 编解码并拒绝未知字段；验证空白名字和分钟范围
- RecordError 定义 EmptyName、InvalidMinutes 变体，通过 thiserror 实现错误；`validate(&Record) -> Result<(), RecordError>`，anyhow 保留其类型以便 downcast_ref
- 解析错误添加上下文，成功发出 tracing span/事件并返回记录 JSON；不依赖订阅者、不启动公网请求、不调用 `process::exit`

```rust starter source=29-ecosystem/starters/ecosystem-project-starter.rs

```
