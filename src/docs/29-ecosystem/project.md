---
type: project
chapterId: ecosystem
id: ecosystem-project
title: 可诊断的学习记录 CLI
---

整合 clap、serde、serde_json、thiserror、anyhow 与 tracing；HTTP 客户端已在本章独立验证。

## 验收要求

- 实现 execute(args: &[`&str`]) -&gt; `anyhow::Result`&lt;`String`&gt;，通过 clap 接收必填 --json 字符串，首项为程序名
- Record { name: `String`, minutes: `u32` } 派生 JSON 编解码并拒绝未知字段；验证空白名字和分钟范围
- RecordError 定义 EmptyName、InvalidMinutes 变体，通过 thiserror 实现错误；validate(&Record) -&gt; `Result`&lt;(), RecordError&gt;，anyhow 保留其类型以便 downcast_ref
- 解析错误添加上下文，成功发出 tracing span/事件并返回记录 JSON；不依赖订阅者、不启动公网请求、不调用 `process::exit`

```rust starter
use clap::Parser;

#[derive(Parser)]

struct Args {
    #[arg(long)]
    json: String,
}

#[derive(serde::Serialize, serde::Deserialize)]

#[serde(deny_unknown_fields)]

struct Record {
    name: String,
    minutes: u32,
}

#[derive(Debug, thiserror::Error)]

enum RecordError {
    #[error("名字不能为空")]
    EmptyName,
    #[error("分钟必须为 1..=180")]
    InvalidMinutes,
}

fn validate(record: &Record) -> Result<(), RecordError> {
    todo!()
}

fn execute(args: &[&str]) -> anyhow::Result<String> {
    todo!()
}

fn main() {
    println!(
        "{:?}",
        execute(&["study", "--json", r#"{"name":"甲","minutes":25}"#])
    );
}
```
