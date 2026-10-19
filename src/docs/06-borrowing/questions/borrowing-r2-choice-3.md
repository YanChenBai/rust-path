---
id: borrowing-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 检查被跳过
  - 所有权变成 Rc
  - 调用使用了更短的重新借用
  - 引用被深复制
type: question
chapterId: borrowing
order: 2
assessment:
  answer: 调用使用了更短的重新借用
  explanation: 子借用结束后，父引用可以继续访问。
  mode: fold
---

函数临时接收 `&mut T` 后，原可变引用通常为何还能使用？
