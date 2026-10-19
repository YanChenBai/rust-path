---
id: start-extra-code
kind: code
title: 可复用的签到标签
type: question
chapterId: start
order: 7
---

实现 checkin(name: `&str`, day: `u32`) -&gt; `String`，返回“名字：第 N 天”。保留名字原样，包括空串和空格；例如 checkin("Ada", 2) 返回 "Ada：第 2 天"。 本题函数签名、参数类型和 `main` 都是已提供骨架；先保留它们，只修改 `format!` 的模板文本。

```rust starter
fn checkin(name: &str, day: u32) -> String {
    // 参数已经提供，使用花括号把 name 与 day 放进模板。
    format!("请修改签到模板：{name} / {day}")
}

fn main() {
    println!("{}", checkin("小林", 2));
}
```
