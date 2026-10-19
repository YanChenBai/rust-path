// region:answer
fn append_shared(draft: &std::rc::Rc<std::cell::RefCell<String>>, suffix: &str) -> usize {
    let mut text = draft.borrow_mut();
    text.push_str(suffix);
    text.chars().count()
}
// endregion:answer

fn main() {
// region:tests
let draft = std::rc::Rc::new(std::cell::RefCell::new(String::new()));
let backup = std::rc::Rc::clone(&draft);
assert_eq!(append_shared(&draft, ""), 0);
assert_eq!(append_shared(&draft, "Rust"), 4);
assert_eq!(append_shared(&backup, "笔记"), 6);
assert_eq!(append_shared(&draft, "🦀"), 7);
assert_eq!(backup.borrow().as_str(), "Rust笔记🦀");
assert_eq!(append_shared(&draft, ""), 7);
assert_eq!(draft.borrow().as_str(), "Rust笔记🦀");
assert_eq!(std::rc::Rc::strong_count(&draft), 2);
assert!(draft.try_borrow_mut().is_ok());
// endregion:tests
    println!("__PASS__");
}
