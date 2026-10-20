---
id: text-processing
title: 借用文本与拥有结果
subtitle: 输入借用与输出分配应由接口表达。
minutes: 16
type: lesson
chapterId: strings
order: 1
---

## 输入借用与输出分配应由接口表达。

只读文本参数通常接收 `&str`。这样字符串字面量和 `String` 的借用都可传入，不要求调用者额外分配。trim 与 split_whitespace 返回借用视图，to_owned 创建独立 `String`；返回值需要在输入释放后继续存在时，就应选择拥有所有权的结果。

split_whitespace 将连续空白视为分隔符，适合按词读取简单文本，却不能替代 CSV 或具有引号转义的格式解析。示例先清理外侧空白，再逐词组成报告。`String::push_str` 追加字符串切片，push 追加单个 char，不需要每次 `format!` 都创建一个临时字符串。

处理日志时先明确保留规则：空白是否有意义、大小写是否敏感、中文按字节还是字符截断。Unicode 大小写转换可能改变长度，不能假设变换后仍对应原有偏移。练习使用 Unicode 标量值计数，明确不处理组合字形的显示宽度。

<CourseCallout>

借用结果依赖输入仍存活；to_owned 会创建独立的所有者。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

修改报告为每词一行，并覆盖空输入、中文和连续空白。

</CourseCallout>

```rust playground id=text-processing source=07-strings/src/bin/text-processing.rs

```
