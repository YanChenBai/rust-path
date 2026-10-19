---
type: guide
lessonId: iterators
index: 3
title: 闭包捕获与消费后的状态
mistake: 不要在 map 中放必须执行的业务副作用却忘记消费管道。filter 在 iter() 后可能接收双层引用，先写出 Item 类型再判断需要解引用几次。
---

### 4. 闭包捕获与消费后的状态

闭包可以共享借用、可变借用或移动捕获环境，取决于其使用方式。示例中 calls 被可变借用，所以不能在该闭包仍需使用时随意读取或修改 calls；管道消费完成后即可检查最终次数。迭代器被 next 推进后不会自动从头开始，消费后的重用也受所有权约束。若要再次遍历原数据，可以重新调用 values.iter，而不是假设旧管道会重置。
<CourseCallout title="容易混淆的地方">

不要在 map 中放必须执行的业务副作用却忘记消费管道。filter 在 iter() 后可能接收双层引用，先写出 Item 类型再判断需要解引用几次。

</CourseCallout>
