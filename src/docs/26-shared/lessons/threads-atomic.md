---
id: threads-atomic
title: Atomic 与 Ordering
subtitle: 原子性与发布关系分开推理
minutes: 18
nativeRequired: true
type: lesson
chapterId: shared
order: 1
advanced: true
---

## 单个值不会撕裂，不代表关联数据已经同步。

原子类型为特定整数、布尔或指针提供不可分割的操作。fetch_add 返回修改前的值，Relaxed 仍然保证这个原子位置上的原子性与修改顺序，但不会自动为其他数据建立发布关系。纯统计计数如果不负责通知其他数据可读，Relaxed 常是合适起点；是否足够必须由程序不变量决定，不能按性能直觉盲选。

Release 写入与读取到对应发布的 Acquire 读取，可以为此前写入和此后读取建立顺序关系。SeqCst 还为相关顺序一致操作提供更强的全局次序约束，但它不是“修复所有并发错误”的开关。不同操作接受的 Ordering 也有约束，例如普通 load 不能使用 Release。高级无锁结构还涉及比较交换失败顺序、ABA 和回收问题，超出本课计数模型。

示例把计数交给 AtomicUsize，并在主线程 join 所有工作后读取。这里 join 已建立完成关系，断言只关心最后的计数，不用原子标志发布别的非原子数据。任何需要保护多个字段一致更新的需求，优先考虑锁和清晰的不变量，避免为了“无锁”而把一个完整状态拆成多个彼此难以协调的原子变量。

<CourseCallout>

原子整数的 fetch_add 有回绕语义，业务累计仍需要定义溢出策略。

</CourseCallout>

## 亲手试一试

```rust playground id=threads-atomic source=26-shared/src/bin/threads-atomic.rs

```

<CourseCallout title="给自己一个小挑战">

把任务数改成零、一个和多个，验证结果；解释为什么这里不用自旋等待。

</CourseCallout>
