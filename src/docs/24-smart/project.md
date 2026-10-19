---
type: project
chapterId: smart
id: smart-project
title: 不会成环的共享树
assessment:
  explanation: 父到子用 Rc，子到父用 Weak；拒绝重复挂载和成环，Drop 计数验证释放。
  answerSource: 24-smart/src/bin/smart-project.rs?region=answer
  testsSource: 24-smart/src/bin/smart-project.rs?region=tests
---

组合 Rc、Weak、RefCell、Cell 与 Drop，验证所有权图的释放。

## 验收要求

- Node 字段为 `name: String`、parent: RefCell&lt;Weak&lt;Node&gt;&gt;、`children: RefCell<Vec<Rc<Node>>>`、`drops: Rc<Cell<usize>>`
- `Node::new(name: &str, drops: Rc<Cell<usize>>) -> Rc<Node>`；`attach(parent: &Rc<Node>, child: &Rc<Node>) -> bool`
- 拒绝自身、重复父亲和祖先环；父持有子强引用，子只弱引用父；Drop 使 drops 加一

```rust starter source=24-smart/starters/smart-project-starter.rs

```
