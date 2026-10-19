---
id: start-extra-choice-2
kind: choice
title: 区分构造与输出
options:
  - |-
    第 3 天
    [第 3 天]
  - '[第 3 天]'
  - label
  - 无法编译：format! 不返回值
type: question
chapterId: start
order: 2
assessment:
  answer: '[第 3 天]'
  explanation: format! 返回 String 而不输出；只有 println! 向终端打印一行。
  mode: fold
---

执行 `let label = format!("第 {} 天", 3); println!("[{label}]");` 时，终端输出什么（不计行末换行）？
