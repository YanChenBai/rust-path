---
id: macros-choice
kind: choice
title: 辨析关键机制
options:
  - 过程宏在编译期处理 token 流
  - 所有带感叹号的宏都是 macro_rules
  - derive 会绕过类型检查
  - 同 crate 可直接定义并使用自定义过程宏
type: question
chapterId: macros
order: 0
assessment:
  answer: 过程宏在编译期处理 token 流
  explanation: derive、属性宏与函数式过程宏由过程宏 crate 提供；macro_rules 使用模式匹配展开。
  mode: fold
---

关于过程宏，哪项正确？
