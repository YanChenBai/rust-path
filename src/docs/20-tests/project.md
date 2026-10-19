---
type: project
chapterId: tests
id: tests-project
title: 修复区间合并器
---

从反例入手实现稳定、可验证的数据处理。

## 验收要求

- 实现 merge_ranges(`mut` ranges: `Vec`&lt;(`u32`,`u32`)&gt;) -&gt; `Vec`&lt;(`u32`,`u32`)&gt;
- 忽略左端大于右端的非法区间，按左端排序
- 闭区间重叠则合并；仅相邻不合并，不能对最大端点做溢出加法

```rust starter
fn merge_ranges(mut ranges: Vec<(u32, u32)>) -> Vec<(u32, u32)> {
    todo!()
}
fn main() {}
```
