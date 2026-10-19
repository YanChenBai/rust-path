---
id: threads-locks
title: Mutex、RwLock 与 Send/Sync
subtitle: 共享所有权不等于共享修改权限
minutes: 18
nativeRequired: true
type: lesson
chapterId: shared
order: 0
advanced: true
---

## 锁守卫控制临界区，自动 trait 约束线程边界。

Arc 允许多个线程拥有同一分配，Mutex 通过互斥锁保护内部可变数据，二者分别解决存活与访问。lock 返回守卫，守卫析构才会释放锁；把守卫绑定在过大的作用域，会让不相关工作也串行。示例在短临界区更新状态，然后在 join 之后检查结果，不靠读取一个尚未同步的普通变量猜测完成。

RwLock 允许多个读者或一个写者，适合某些读多写少负载，但公平性与性能受平台和使用方式影响，不能保证总比 Mutex 快。持有读锁时再申请写锁可能死锁；多把锁需要统一获取顺序。标准库锁可能中毒，表示某个持锁线程发生恐慌，返回错误是在提醒你重新检查业务不变量，不应一律 unwrap 或无条件恢复。

Send 表示类型值可以安全地转移到另一线程，Sync 表示其共享引用可以安全地跨线程使用，也就是 &T 满足 Send。很多类型会自动推导这些 `trait`，Rc 不适合跨线程引用计数，Cell 和 RefCell 不提供同步共享修改。Arc&lt;T&gt; 的线程安全仍取决于 T 的相应约束。不要随意写 unsafe `impl` Send 或 Sync，错误实现会破坏安全代码依赖的前提。

<CourseCallout>

锁内避免网络调用、阻塞等待和回调；先复制必要快照，再释放守卫。

</CourseCallout>

## 亲手试一试

```rust playground id=threads-locks source=26-shared/src/bin/threads-locks.rs

```

<CourseCallout title="给自己一个小挑战">

缩短写守卫作用域，再在另一个线程读取快照，解释 join 提供的完成关系。

</CourseCallout>
