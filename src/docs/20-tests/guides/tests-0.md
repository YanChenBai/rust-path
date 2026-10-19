---
type: guide
lessonId: tests
index: 0
title: 测试是可执行的行为约定
---

### 1. 测试是可执行的行为约定

测试应从外部需求推导预期值，再调用待测函数比较实际结果，而不是把实现公式复制到测试里算一遍。`assert!` 检查布尔条件，`assert_eq!` 比较相等，失败会通过 panic 让测试运行器记录该项失败。普通 assert 在发布构建中也保留，debug_assert 则受调试断言配置影响，不应拿后者承载必须执行的输入验证。

#[test] 标记由测试运行器调用的函数，普通执行 `main` 不会自动运行它们。Cargo 项目使用 cargo test，单文件可用 rustc --edition=2024 --test `main`.rs -o lesson-tests 后运行生成的测试程序。它与普通编译得到的程序是两条不同运行路径，看到 `main` 打印成功不能证明全部 #[test] 已执行。
