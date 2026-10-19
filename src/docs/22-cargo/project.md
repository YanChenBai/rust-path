---
type: project
chapterId: cargo
id: cargo-project
title: 构建计划解析器
---

以受限 Cargo 命令模型练习模块公开接口、结构体与错误处理，不启动外部命令。

## 验收要求

- config 模块公开 BuildPlan { `pub` mode: &'static str, `pub` release: `bool`, `pub` locked: `bool` }，派生 `Debug`、PartialEq
- 公开 plan(args: &[`&str`]) -&gt; `Result`&lt;BuildPlan, `String`&gt;，并用 use `config::plan` 让根作用域可调用
- 仅接受首参数 check/build/test，后续仅 --release、--locked，重复标志幂等；缺命令、未知命令或标志报错

```rust starter
mod config {
    #[derive(Debug, PartialEq)]
    pub struct BuildPlan {
        pub mode: &'static str,
        pub release: bool,
        pub locked: bool,
    }
    pub fn plan(args: &[&str]) -> Result<BuildPlan, String> {
        todo!()
    }
}
use config::plan;

fn main() {
    println!("{:?}", plan(&["build", "--locked"]));
}
```
