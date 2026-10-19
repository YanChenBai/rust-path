use std::cell::RefCell;
let draft = RefCell::new(String::from("A"));
let view = draft.borrow();
let mut edit = draft.borrow_mut();
