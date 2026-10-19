---
id: io-extra-code
kind: code
title: 统计配置中的有效行
type: question
chapterId: io
order: 7
---

实现 count_records&lt;R: `std::io::BufRead`&gt;(reader: R) -&gt; `std::io::Result`&lt;`usize`&gt;。逐行 trim 后，忽略空行和以 # 开头的整行注释，其余每行计 1；行内 # 不特殊处理。读取错误用 ? 原样传播，不访问真实文件。

```rust starter
fn count_records<R: std::io::BufRead>(reader: R) -> std::io::Result<usize> {
    todo!()
}

fn main() {
    let input = std::io::Cursor::new("# config\nport=80\n");
    println!("{:?}", count_records(input));
}
```
