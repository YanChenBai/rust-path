---
id: network-extra-choice-2
kind: choice
title: 确认写入完整响应
options:
  - stream.write(response)，忽略返回字节数
  - stream.read_to_end(response)
  - stream.write_all(response)
  - stream.flush()，无需先写入
type: question
chapterId: network
order: 2
assessment:
  answer: stream.write_all(response)
  explanation: write_all 写完所有字节或返回错误；write 只保证返回本次写入数量，flush 也不会替代写入。
  mode: exact
---

服务器已有完整响应字节 response，需要把全部字节发给 TcpStream。以下哪种调用使用 `std::io::Write` 的保证，能写完全部字节或返回错误？
