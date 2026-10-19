---
id: cargo-extra-choice-1
kind: choice
title: 快速检查命令行项目
options:
  - cargo run
  - cargo check
  - cargo new
  - cargo clean
type: question
chapterId: cargo
order: 1
assessment:
  answer: cargo check
  explanation: cargo check 检查程序，但跳过生成最终可执行文件的步骤；cargo run 还会构建并运行。
  mode: exact
---

修改 `src/main.rs` 后，只想检查类型和借用错误，不生成最终可执行文件，应运行哪条命令？
