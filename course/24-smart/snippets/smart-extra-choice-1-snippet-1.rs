use std::rc::Rc;
let draft = Rc::new(String::from("初稿"));
let copy = Rc::clone(&draft);
