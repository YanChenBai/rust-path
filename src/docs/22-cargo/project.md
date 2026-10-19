---
type: project
chapterId: cargo
id: cargo-project
title: 构建计划解析器
assessment:
  explanation: 这是 Cargo 参数的受限模型，不执行 Cargo。模块、可见性、Result 与参数校验共同构成接口。
  answerSource: 22-cargo/src/bin/cargo-project.rs?region=answer
  testsSource: 22-cargo/src/bin/cargo-project.rs?region=tests
---

以受限 Cargo 命令模型练习模块公开接口、结构体与错误处理，不启动外部命令。

## 验收要求

- config 模块公开 `BuildPlan { pub mode: &'static str, pub release: bool, pub locked: bool }`，派生 `Debug`、PartialEq
- 公开 `plan(args: &[&str]) -> Result<BuildPlan, String>`，并用 `use config::plan` 让根作用域可调用
- 仅接受首参数 check/build/test，后续仅 --release、--locked，重复标志幂等；缺命令、未知命令或标志报错

```rust starter source=22-cargo/starters/cargo-project-starter.rs

```
