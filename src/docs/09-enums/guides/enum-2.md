---
type: guide
lessonId: enum
index: 2
title: 提取内部值需要选择所有权方式
---

### 3. 提取内部值需要选择所有权方式

对 `Option<String>` 按值匹配 `Some(text)` 会取出拥有的 `String`，通常使原 `Option` 无法再整体使用。只想读取可以匹配 &option，或者用 as_ref 得到 `Option<&String>`；想得到 `Option<&str>` 可用 as_deref。`if` `let` 适合只关心一个模式且其他情况无需处理的场合，完整业务状态处理则优先使用能检查穷尽的 `match`。
