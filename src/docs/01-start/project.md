---
type: project
chapterId: start
id: start-project
title: 我的学习名片
---

组合函数、字符串和格式化输出，生成你的第一张命令行名片。

## 验收要求

- 实现 profile(name: `&str`, days: `u32`) -&gt; `String`
- 返回格式：名字 | Rust 第 N 天
- 支持中文名字和第 0 天

```rust starter
fn profile(name: &str, days: u32) -> String {
    todo!()
}

fn main() {
    println!("{}", profile("小林", 1));
}
```
