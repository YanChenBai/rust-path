---
id: macros-extra-fill-1
kind: fill
title: 匹配一个表达式
type: question
chapterId: macros
order: 4
---

填宏片段指定符，使调用 bracket!(2 + 3) 合法：
macro_rules! bracket {
($value:____) =&gt; { `format!`("[{}]", $value) };

```rust
}
```
