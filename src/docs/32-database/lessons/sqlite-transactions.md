---
id: sqlite-transactions
title: 事务与回滚
subtitle: 一组相关更新必须全部成功，才能提交。
minutes: 16
type: lesson
chapterId: database
order: 1
---

## 一组相关更新必须全部成功，才能提交。

事务将多条相关语句作为一个提交单位。例如写入学习记录与更新总时长应同时成立，不能在第二步失败时留下第一步。先开启事务，在事务连接上执行所有更新，成功后显式 commit。遇到错误提前返回，未提交的事务被释放时会回滚。

数据库约束是最后一道保护。NOT NULL、UNIQUE 和 CHECK 可以拒绝不符合结构约定的数据，但应用仍要给用户提供可理解的错误。测试不仅检查返回 `Err`，还要再查询数据库，确认失败之前写入的行没有偷偷保留。

迁移负责数据库结构从一个版本演进到另一个版本，不能只在代码里改变结构体就期望已有文件自动更新。备份、并发访问、连接忙等待与事务持续时间也需要设计。示例采用小型内存事务，重点观察“未提交即回滚”，后续文件项目再应用同样的边界。

<CourseCallout>

业务更新失败后再查询状态，才能证明回滚而不只是证明返回了错误。

</CourseCallout>

## 亲手试一试

```rust playground id=sqlite-transactions source=32-database/src/bin/sqlite-transactions.rs

```

<CourseCallout title="给自己一个小挑战">

在事务内第二次写入触发 CHECK，确认第一条写入也被回滚。

</CourseCallout>
