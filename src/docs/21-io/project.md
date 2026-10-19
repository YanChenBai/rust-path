---
type: project
chapterId: io
id: io-project
title: 文件摘要器
---

组合 Path、文件缓冲读取、文本筛选、结果写入与错误传播。

## 验收要求

- 实现 summarize_file(input: &`std::path::Path`, output: &`std::path::Path`) -&gt; `std::io::Result`&lt;`usize`&gt;
- 统计 trim 后非空行数，输出精确为 lines=N 加换行，覆盖已有输出并显式 flush
- 输入不存在需报错，输入输出路径文本相同需拒绝；输入输出限定无别名的普通文件

```rust starter
fn summarize_file(
    input: &std::path::Path,
    output: &std::path::Path,
) -> std::io::Result<usize> {
    todo!()
}

fn main() {
    println!("请通过项目断言创建临时文件验证");
}
```
