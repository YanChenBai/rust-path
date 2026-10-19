---
type: project
chapterId: macros
id: macros-project
title: 声明式配置表
---

把宏重复匹配与稳定集合结合，定义清楚空输入、覆盖和求值次数。

## 验收要求

- 实现 settings!(key =&gt; value, ...) 返回 BTreeMap&lt;`String`, `i32`&gt;，支持零项和尾逗号
- key 可传 `&str`、`String` 或 &`String`，通过 `String::from` 拥有键；value 为 `i32`
- 按键排序，重复键后写覆盖，键与值表达式都只执行一次

```rust starter
macro_rules! settings {
    ($($key:expr => $value:expr),* $(,)?) => {{ todo!() }};
}

fn main() {
    let map: std::collections::BTreeMap<String, i32> = settings!("limit" => 3);
    println!("{map:?}");
}
```
