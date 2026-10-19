// region:answer
fn archive(text: String) -> (String, usize) {
    let n = text.len();
    (text, n)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(archive(String::from("Rust")),(String::from("Rust"),4));assert_eq!(archive(String::from("你好")),(String::from("你好"),6));assert_eq!(archive(String::new()),(String::new(),0));
// endregion:tests
    println!("__PASS__");
}
