---
type: guide
lessonId: tests
index: 3
title: 隔离状态，理解测试发现范围
mistake: 不要在 main 中只调用 println!("测试通过") 就声称运行了测试；也不要用过宽的 should_panic 让无关 panic 掩盖真正缺陷。
---

### 4. 隔离状态，理解测试发现范围

单元测试常与实现放在同模块，可以访问内部细节；Cargo 的 tests 目录适合集成测试，主要从公开接口验证。测试运行器通常并行执行，不应依赖其他测试先运行、固定全局计数或复用相同临时文件名。默认输出捕获可用 cargo test -- --nocapture 调整，但日志不是断言。通过当前用例只说明已观察到的行为符合预期，仍要寻找遗漏的边界和不变量。
<CourseCallout title="容易混淆的地方">

不要在 `main` 中只调用 `println!`("测试通过") 就声称运行了测试；也不要用过宽的 should_panic 让无关 panic 掩盖真正缺陷。

</CourseCallout>
