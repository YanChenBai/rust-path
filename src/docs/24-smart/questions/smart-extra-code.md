---
id: smart-extra-code
kind: code
title: 追加共享草稿
type: question
chapterId: smart
order: 7
---

实现 append_shared(draft: &`std::rc::Rc`&lt;`std::cell::RefCell`&lt;`String`&gt;&gt;, suffix: `&str`) -&gt; `usize`。追加 suffix，返回追加后的 Unicode 标量值数量；所有 Rc 克隆都应看到修改。调用时没有活跃借用。

```rust starter
fn append_shared(
    draft: &std::rc::Rc<std::cell::RefCell<String>>,
    suffix: &str,
) -> usize {
    todo!()
}

fn main() {
    let draft = std::rc::Rc::new(std::cell::RefCell::new(String::from("Rust")));
    println!("{}", append_shared(&draft, "笔记"));
}
```
