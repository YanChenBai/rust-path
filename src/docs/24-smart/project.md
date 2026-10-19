---
type: project
chapterId: smart
id: smart-project
title: 不会成环的共享树
---

组合 Rc、Weak、RefCell、Cell 与 Drop，验证所有权图的释放。

## 验收要求

- Node 字段为 name: `String`、parent: RefCell&lt;Weak&lt;Node&gt;&gt;、children: RefCell&lt;`Vec`&lt;Rc&lt;Node&gt;&gt;&gt;、drops: Rc&lt;Cell&lt;`usize`&gt;&gt;
- `Node::new(name: &str, drops: Rc<Cell<usize>>)` -&gt; Rc&lt;Node&gt;；attach(parent: &Rc&lt;Node&gt;, child: &Rc&lt;Node&gt;) -&gt; `bool`
- 拒绝自身、重复父亲和祖先环；父持有子强引用，子只弱引用父；Drop 使 drops 加一

```rust starter
use std::cell::{Cell, RefCell};
use std::rc::{Rc, Weak};

struct Node {
    name: String,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
    drops: Rc<Cell<usize>>,
}

impl Node {
    fn new(name: &str, drops: Rc<Cell<usize>>) -> Rc<Self> {
        todo!()
    }
    fn attach(parent: &Rc<Self>, child: &Rc<Self>) -> bool {
        todo!()
    }
}

impl Drop for Node {
    fn drop(&mut self) {
        todo!()
    }
}

fn main() {
    let _root = Node::new("根", Rc::new(Cell::new(0)));
}
```
