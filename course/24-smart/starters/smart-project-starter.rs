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
