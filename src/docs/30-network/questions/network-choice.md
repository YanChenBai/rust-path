---
id: network-choice
kind: choice
title: 辨析关键机制
options:
  - TCP 是有序字节流，没有消息边界
  - 一次 write 对应一次 read
  - UDP 自动重传所有丢失数据
  - 端口零表示连接公网默认服务
type: question
chapterId: network
order: 0
assessment:
  answer: TCP 是有序字节流，没有消息边界
  explanation: 单次 write 不对应单次 read；应用必须定义定长、分隔符或长度前缀等协议。
  mode: fold
---

关于 TCP，哪项正确？
