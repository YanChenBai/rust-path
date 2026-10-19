---
id: variables-extra-choice-2
kind: choice
title: 局部调整目标
options:
  - |-
    45
    45
  - |-
    30
    45
  - |-
    45
    30
  - 无法编译：target 必须为 mut
type: question
chapterId: variables
order: 2
assessment:
  answer: |-
    45
    30
  explanation: 内层 target 是新绑定，内层输出 45；退出代码块后仍使用外层的 30。
  mode: fold
---

执行下列代码，最后打印什么？

```rust source=02-variables/snippets/variables-extra-choice-2-snippet-1.rs

```
