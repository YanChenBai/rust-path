---
type: guide
lessonId: vec
index: 1
title: 顺序记录与按键汇总使用不同容器
---

### 2. 顺序记录与按键汇总使用不同容器

示例先用 `Vec` 保留记录顺序，再用 `HashMap` 按名字累计分钟数。entry 查找键并返回入口，or_insert 在键缺失时建立零值，并给出可变引用，解引用后即可累加。取值使用 get，找到时得到借用，未找到时得到 `None`。最终按固定名字顺序读取，避免把 `HashMap` 未承诺的遍历顺序当作排行榜顺序。

```rust runnable id=vec-guide-1 source=10-collections/src/bin/vec-guide-1.rs

```
