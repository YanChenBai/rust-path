---
id: async-extra-code
kind: code
title: 异步批次校验
type: question
chapterId: async
order: 7
---

实现 `async` `fn` batch_total(inputs: &[`&str`]) -&gt; `Result`&lt;`u32`, `String`&gt;。内部定义并 `await` 一个异步解析函数：先 trim 后用 parse::&lt;`u32`&gt;() 解析每项（采用该解析器的规则），失败返回 "无效记录"；使用 checked_add，溢出返回 "总和溢出"；空输入返回 `Ok`(0)。不访问网络，不创建运行时；运行时由 `main` 和测试提供。

```rust starter
async fn batch_total(inputs: &[&str]) -> Result<u32, String> {
    todo!()
}

fn main() {
    let rt = tokio::runtime::Runtime::new().unwrap();
    println!("{:?}", rt.block_on(batch_total(&["20", " 5 "])));
}
```
