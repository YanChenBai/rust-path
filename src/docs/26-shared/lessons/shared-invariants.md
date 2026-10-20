---
id: shared-invariants
title: 锁保护的是不变量
subtitle: Arc 共享所有权，Mutex 保护访问，二者不能互相替代。
minutes: 16
type: lesson
chapterId: shared
order: 2
---

## Arc 共享所有权，Mutex 保护访问，二者不能互相替代。

Arc 的原子引用计数只管理有多少所有者，不会让里面的普通可变数据自动安全。Mutex 的守卫在持有时提供独占访问，释放守卫才让其他线程进入。把它们组合成 Arc&lt;Mutex&lt;T&gt;&gt;，同时表达跨线程拥有与互斥访问。

临界区应覆盖一个完整不变量，例如先检查余额再扣款，不能把两步分别上锁，否则中间可能插入别的线程。反过来，拿着锁做网络请求、等待线程退出或调用未知用户代码，会延长占用甚至产生死锁。先提取需要的数据，释放锁后再做慢操作。

线程恐慌时，标准 Mutex 可能被标记为 poisoned。锁中毒不是自动恢复业务一致性的证明；应用需要决定停止、重建还是检查后恢复。示例采用 expect，因为固定演示不安排恐慌，真实接口应把失败放到 `Result` 中处理。原子计数适合单个数值的独立状态，不能用多个原子随意替代一组必须同时成立的约束。

<CourseCallout>

先设计一次更新必须同时完成哪些步骤，再选择临界区边界。

</CourseCallout>

## 亲手试一试

<CourseCallout title="给自己一个小挑战">

把两个独立加锁操作改成一次加锁的完整更新，解释竞态窗口的区别。

</CourseCallout>

```rust playground id=shared-invariants source=26-shared/src/bin/shared-invariants.rs

```
