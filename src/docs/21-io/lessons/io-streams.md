---
id: io-streams
title: BufRead 与 Write
subtitle: 流式处理并显式提交缓冲区
minutes: 18
nativeRequired: true
type: lesson
chapterId: io
order: 0
advanced: true
---

## 读取可以失败，写入也可能只完成一部分。

Read 和 Write 描述字节流接口，不限定底层一定是文件。BufRead 在读取之上提供缓冲与按行处理能力；BufReader 减少频繁的小块系统读取。lines 返回每行的 `Result<String>`，行结束符被去掉，但读取错误仍需传播，不能只处理解析错误。对大文件逐行计算可以限制峰值内存，而 read_to_string 会一次持有全部内容。

write 允许只写出部分字节，write_all 才会尝试把整个切片写完。BufWriter 先把数据暂存在内存，flush 把缓冲内容交给下层；只依赖 Drop 不能方便地获知最终写入错误。flush 不等于磁盘掉电持久化，需要持久性时还要理解 `File::sync_all` 与文件系统保证，不能把成功返回解释为所有环境下绝不丢失。

示例把求和函数写成泛型 BufRead，让内存 Cursor 与文件共享同一逻辑。业务算法不应到处打开路径或读取全局参数，注入读取器更容易测试。`i64` 解析成功不代表累计不会溢出，因此用 checked_add 把总和错误显式转换为 InvalidData。测试除了正常数字，还需要覆盖空行、非法输入以及接近整数上界的情况。

<CourseCallout>

按行文本处理要求输入是 UTF-8；任意二进制应使用 read 或 read_until 等字节接口。

</CourseCallout>

## 亲手试一试

```rust playground id=io-streams source=21-io/src/bin/io-streams.rs

```

<CourseCallout title="给自己一个小挑战">

增加一个返回错误的自定义读取器，验证读取失败不会被当作空输入。

</CourseCallout>
