---
id: shutdown-r2-choice-3
kind: choice
title: 选择合适接口
options:
  - 避免编译
  - 自动回滚所有副作用
  - 确认任务已退出并完成清理
  - 让信号变成全局变量
type: question
chapterId: shutdown
order: 2
assessment:
  answer: 确认任务已退出并完成清理
  explanation: 请求取消与完成退出是两个时刻。
  mode: fold
---

发出取消信号后为何还需要等待任务？
