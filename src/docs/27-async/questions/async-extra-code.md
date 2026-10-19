---
id: async-extra-code
kind: code
title: 异步批次校验
type: question
chapterId: async
order: 7
assessment:
  explanation: 异步解析函数返回 Future，由外层 await 驱动，再用 ? 传播错误。checked_add 将溢出转为业务错误；运行时由调用方统一提供，不在异步函数内部嵌套 block_on。
  answerSource: 27-async/src/bin/async-extra-code.rs?region=answer
  testsSource: 27-async/src/bin/async-extra-code.rs?region=tests
---

实现 `async fn batch_total(inputs: &[&str]) -> Result<u32, String>`。内部定义并 `await` 一个异步解析函数：先 trim 后用 `parse::<u32>()` 解析每项（采用该解析器的规则），失败返回 "无效记录"；使用 checked_add，溢出返回 "总和溢出"；空输入返回 `Ok(0)`。不访问网络，不创建运行时；运行时由 `main` 和测试提供。

```rust starter source=27-async/starters/async-extra-code-starter.rs

```
