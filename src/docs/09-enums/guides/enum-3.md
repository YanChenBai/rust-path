---
type: guide
lessonId: enum
index: 3
title: 缺失、失败与默认值不是同一个概念
mistake: 不要用多个 bool 模拟互斥阶段，也不要把 None 当成可直接进行加法的零。先匹配或转换 Option，再使用内部值。
---

### 4. 缺失、失败与默认值不是同一个概念

`Option` 适合查找未命中或没有下一项等正常缺失，`Result` 适合需要说明失败原因的操作。unwrap 遇到 `None` 会 panic，不会自动变成默认值；unwrap_or 需要立即计算默认参数，默认值构造昂贵时可用 unwrap_or_else 延迟生成。即使选择默认值，也要确认它不会掩盖损坏的配置或用户输入错误，不能把所有缺失都当作零处理。
<CourseCallout title="容易混淆的地方">

不要用多个 `bool` 模拟互斥阶段，也不要把 `None` 当成可直接进行加法的零。先匹配或转换 `Option`，再使用内部值。

</CourseCallout>
