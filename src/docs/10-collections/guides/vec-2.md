---
type: guide
lessonId: vec
index: 2
title: 越界处理应符合数据可信程度
---

### 3. 越界处理应符合数据可信程度

索引语法 values[index] 要求下标有效，越界会 panic；get 返回 `Option`，迫使调用者安排没有该元素的情况。来自用户的下标、空集合和查询未命中，通常应该正常处理，而不是使用 unwrap 把它们变成崩溃。remove 删除并移动后续元素以保持顺序，swap_remove 用末项补位但不保持顺序，应按需求选择，不能只因为后者更快就替换。
