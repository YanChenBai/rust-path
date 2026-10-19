---
id: smart-extra-code
kind: code
title: 追加共享草稿
type: question
chapterId: smart
order: 7
assessment:
  explanation: Rc 克隆共享同一 RefCell，borrow_mut 在局部取得独占访问；函数返回时守卫释放。chars().count() 按 Unicode 标量值计数。
  answerSource: 24-smart/src/bin/smart-extra-code.rs?region=answer
  testsSource: 24-smart/src/bin/smart-extra-code.rs?region=tests
---

实现 `append_shared(draft: &std::rc::Rc<std::cell::RefCell<String>>, suffix: &str) -> usize`。追加 suffix，返回追加后的 Unicode 标量值数量；所有 Rc 克隆都应看到修改。调用时没有活跃借用。

```rust starter source=24-smart/starters/smart-extra-code-starter.rs

```
