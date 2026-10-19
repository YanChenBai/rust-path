---
type: project
chapterId: dyn
id: dyn-project
title: 可扩展报表渲染器
---

把异构对象、借用、`trait` 与字符串拼接组合起来。

## 验收要求

- 定义 `trait` Render { `fn` render(&self) -&gt; `String`; }
- 定义 Text(`String`)、Count(`u32`)，实现 Render，分别返回原文本与十进制数字
- 实现 report(items: &[&dyn Render]) -&gt; `String`，按顺序用换行连接，无额外尾换行

```rust starter
trait Render {
    fn render(&self) -> String;
}
struct Text(String);
struct Count(u32);
fn report(items: &[&dyn Render]) -> String {
    todo!()
}
fn main() {}
```
