fn append_shared(
    draft: &std::rc::Rc<std::cell::RefCell<String>>,
    suffix: &str,
) -> usize {
    todo!()
}

fn main() {
    let draft = std::rc::Rc::new(std::cell::RefCell::new(String::from("Rust")));
    println!("{}", append_shared(&draft, "笔记"));
}
