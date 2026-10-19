// region:answer
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
        Rc::new(Self { name: name.into(), parent: RefCell::new(Weak::new()), children: RefCell::new(Vec::new()), drops })
    }
    fn attach(parent: &Rc<Self>, child: &Rc<Self>) -> bool {
        if Rc::ptr_eq(parent, child) || child.parent.borrow().upgrade().is_some() { return false; }
        let mut ancestor = Some(Rc::clone(parent));
        while let Some(node) = ancestor {
            if Rc::ptr_eq(&node, child) { return false; }
            ancestor = node.parent.borrow().upgrade();
        }
        *child.parent.borrow_mut() = Rc::downgrade(parent);
        parent.children.borrow_mut().push(Rc::clone(child));
        true
    }
}
impl Drop for Node {
    fn drop(&mut self) { self.drops.set(self.drops.get() + 1); }
}
// endregion:answer

fn main() {
// region:tests
let drops = Rc::new(Cell::new(0));
let root = Node::new("根", Rc::clone(&drops));
let child = Node::new("叶", Rc::clone(&drops));
assert_eq!(child.name, "叶"); assert!(Node::attach(&root, &child));
assert!(!Node::attach(&root, &child)); assert!(!Node::attach(&root, &root));
assert!(!Node::attach(&child, &root));
assert_eq!(root.children.borrow().len(), 1);
let weak = Rc::downgrade(&root); drop(root);
assert!(weak.upgrade().is_none()); assert!(child.parent.borrow().upgrade().is_none());
assert_eq!(drops.get(), 1); drop(child); assert_eq!(drops.get(), 2);
// endregion:tests
    println!("__PASS__");
}
