---
type: guide
lessonId: hello
index: 1
title: 按调用顺序追踪输出
---

### 2. 按调用顺序追踪输出

下面程序先打印开始，再调用 greet，等 greet 返回后才打印结束。`println!` 会向标准输出写入格式化文本，并追加换行；它不是创建一个可保存的字符串。感叹号说明这是宏调用，编译器会展开宏，再对展开结果进行检查。先预测三行输出顺序，再修改调用位置，可以把函数定义与函数执行区分开。

```rust runnable id=hello-guide-1 source=01-start/src/bin/hello-guide-1.rs

```
