// region:answer
fn before_space(text: &str) -> &str {
    match text.find(' ') {
        Some(i) => &text[..i],
        None => text,
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(before_space("你好 Rust"), "你好");
    assert_eq!(before_space(" Rust"), "");
    assert_eq!(before_space("abc"), "abc");
    assert_eq!(before_space(""), "");
// endregion:tests
    println!("__PASS__");
}
