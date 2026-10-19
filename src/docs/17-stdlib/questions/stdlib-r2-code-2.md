---
id: stdlib-r2-code-2
kind: code
title: 提取匹配数据
type: question
chapterId: stdlib
order: 7
assessment:
  explanation: 实现 take_nonempty(value:&mut Option<String>)->Option<String>；若 Some 非空则取出并留下 None，否则不改变输入返回 None。 参考实现先处理边界，再构造结果；修改后应重新提交全部测试。
  answerSource: 17-stdlib/src/bin/stdlib-r2-code-2.rs?region=answer
  testsSource: 17-stdlib/src/bin/stdlib-r2-code-2.rs?region=tests
---

实现 `take_nonempty(value:&mut Option<String>)->Option<String>`；若 `Some` 非空则取出并留下 `None`，否则不改变输入返回 `None`。

```rust starter source=17-stdlib/starters/stdlib-r2-code-2-starter.rs

```
