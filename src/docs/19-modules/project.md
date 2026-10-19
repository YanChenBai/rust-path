---
type: project
chapterId: modules
id: modules-project
title: 封装学习时长领域模型
---

用模块与私有字段守住校验约束。

## 验收要求

- 定义 mod domain，公开 Minutes，内部字段私有
- `Minutes::new(u32)` -&gt; `Option`&lt;Self&gt; 只接受 1..=180；get(&self) -&gt; `u32` 返回值
- 实现 `pub` `fn` parse(input: `&str`) -&gt; `Option`&lt;Minutes&gt;，trim 后解析并调用构造函数

```rust starter
mod domain {
    pub struct Minutes(u32);
    // 在这里提供公开构造、读取方法和 parse 函数。
}
fn main() {}
```
