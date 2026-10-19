---
id: cargo-choice
kind: choice
title: 辨析关键机制
options:
  - cargo check 不生成最终可执行文件
  - cargo build 总会运行全部测试
  - feature 总是互斥
  - 模块等于 package
type: question
chapterId: cargo
order: 0
assessment:
  answer: cargo check 不生成最终可执行文件
  explanation: check 检查代码但通常跳过最终代码生成；build 生成构建产物。
  mode: fold
---

关于 Cargo 检查与构建，哪项正确？
