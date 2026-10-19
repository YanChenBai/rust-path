---
type: guide
lessonId: tests
index: 1
title: 一份示例同时支持普通运行与测试运行
---

### 2. 一份示例同时支持普通运行与测试运行

下面 `main` 用断言展示正常行为，tests 模块由 cfg(test) 限定，只在测试构建中编译。第一项测试用表格覆盖零、边界前后和多个完整小时；第二项刻意传入超出约定的值，并要求出现特定提示。普通运行验证四个输入，测试运行器则会发现并运行两个测试；修改除数后能观察哪些边界用例首先失败。

```rust runnable id=tests-guide-1 source=20-tests/src/bin/tests-guide-1.rs

```
