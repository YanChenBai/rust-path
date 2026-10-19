---
id: cargo-extra-code
kind: code
title: 使用配置模块选择端口
type: question
chapterId: cargo
order: 7
---

在单个源码中定义内联 mod config，其中 `pub` `fn` default_port() -&gt; `u16` 返回 8080；实现顶层 selected_port(value: `Option`&lt;`u16`&gt;) -&gt; `u16`。`Some`(port) 保留原值（包括 0），`None` 通过 `config::default_port()` 取得默认值。测试也会直接调用该模块函数。

```rust starter
mod config {
    pub fn default_port() -> u16 {
        todo!()
    }
}

fn selected_port(value: Option<u16>) -> u16 {
    todo!()
}

fn main() {
    println!("{}", selected_port(None));
}
```
