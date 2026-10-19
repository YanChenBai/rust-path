---
id: threads-atomic
title: Atomic 与 Ordering
subtitle: 原子性与发布关系分开推理
minutes: 18
nativeRequired: true
type: lesson
chapterId: shared
order: 1
---

## 单个值不会撕裂，不代表关联数据已经同步。

原子类型为特定整数、布尔或指针提供不可分割的操作。fetch_add 返回修改前的值，Relaxed 仍然保证这个原子位置上的原子性与修改顺序，但不会自动为其他数据建立发布关系。纯统计计数如果不负责通知其他数据可读，Relaxed 常是合适起点；是否足够必须由程序不变量决定，不能按性能直觉盲选。

Release 写入与读取到对应发布的 Acquire 读取，可以为此前写入和此后读取建立顺序关系。SeqCst 还为相关顺序一致操作提供更强的全局次序约束，但它不是“修复所有并发错误”的开关。不同操作接受的 Ordering 也有约束，例如普通 load 不能使用 Release。高级无锁结构还涉及比较交换失败顺序、ABA 和回收问题，超出本课计数模型。

示例把计数交给 AtomicUsize，并在主线程 join 所有工作后读取。这里 join 已建立完成关系，断言只关心最后的计数，不用原子标志发布别的非原子数据。任何需要保护多个字段一致更新的需求，优先考虑锁和清晰的不变量，避免为了“无锁”而把一个完整状态拆成多个彼此难以协调的原子变量。

<CourseCallout>

原子整数的 fetch_add 有回绕语义，业务累计仍需要定义溢出策略。

</CourseCallout>

## 亲手试一试

```rust playground id=threads-atomic
use std::sync::{
    Arc,
    atomic::{AtomicUsize, Ordering},
};

fn main() {
    // 保存计数器的访问入口，后续代码使用它更新或观察计数。
    let counter = Arc::new(AtomicUsize::new(0));

    // 保存所有并发工作的句柄，后面逐个等待，避免遗漏后台任务。
    let mut jobs = Vec::new();
    for _ in 0..4 {
        // 保存计数器的访问入口，后续代码使用它更新或观察计数。
        let counter = Arc::clone(&counter);
        jobs.push(std::thread::spawn(move || {
            for _ in 0..100 {
                // 原子更新避免计数操作被其他线程交错覆盖。
                counter.fetch_add(1, Ordering::Relaxed);
            }
        }));
    }
    for job in jobs {
        // 等待线程结束后再读取最终结果。
        job.join().unwrap();
    }

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(counter.load(Ordering::Relaxed), 400);
}
```

<CourseCallout title="给自己一个小挑战">

把任务数改成零、一个和多个，验证结果；解释为什么这里不用自旋等待。

</CourseCallout>
