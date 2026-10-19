---
type: project
chapterId: generics
id: generics-project
title: 通用稳定去重器
---

把拥有权移动、集合遍历与泛型边界组合起来。

## 验收要求

- 实现 unique&lt;T: PartialEq&gt;(items: `Vec`&lt;T&gt;) -&gt; `Vec`&lt;T&gt;
- 保留首次出现的元素及其顺序，不要求 `Clone`、`Copy` 或 Hash
- 空输入返回空 `Vec`

```rust starter
fn unique<T: PartialEq>(items: Vec<T>) -> Vec<T> {
    todo!()
}
fn main() {}
```
