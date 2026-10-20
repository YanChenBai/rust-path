---
id: io-path-cli
title: Path 与 CLI 边界
subtitle: 路径不是普通的 UTF-8 字符串
minutes: 18
nativeRequired: true
type: lesson
chapterId: io
order: 1
advanced: true
---

## 把参数解析、资源打开和业务处理分成可观察的步骤。

Path 是路径的借用视图，PathBuf 拥有可修改的路径。路径可能包含非 UTF-8 的操作系统表示，因此生产命令行程序读取文件名时优先使用 args_os，而不是假定所有参数都能变成 `String`。join 根据平台规则构造路径，不能靠手工拼接斜杠跨平台；绝对路径片段还可能替换原有前缀，处理不可信输入时需要明确访问范围。

示例用独立临时目录写入中文文件名，作用域结束后再读取，确保缓冲写入已经显式完成。临时目录名组合进程号和时间戳以降低碰撞概率，并用 create_dir 在碰撞时返回错误。这里展示正常路径的清理；生产代码如果需要在任意错误路径也清理，应额外设计资源守卫，而不是忽略 remove_dir 的失败。

命令行入口适合集中显示错误并选择退出码，业务函数则返回 `Result`。下面的可运行示例不要求用户提供参数，只展示从 args_os 取得可选路径；真正的练习把路径作为函数参数，以便断言重复运行。判断两个 Path 文本不同并不能证明它们指向不同文件，符号链接和硬链接需要更严格的身份策略，本章项目限定普通独立文件路径。

<CourseCallout>

不要无条件 canonicalize 尚不存在的输出路径；它会因为目标不存在而失败。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

在副本程序中从 args_os 接收路径，缺少参数时返回明确错误而不是 unwrap。

</CourseCallout>

```rust playground id=io-path-cli source=21-io/src/bin/io-path-cli.rs

```
