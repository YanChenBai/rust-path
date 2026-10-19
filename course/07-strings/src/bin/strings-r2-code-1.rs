// region:answer
fn char_count(text: &str) -> usize {
    text.chars().count()
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(char_count(""), 0);
    assert_eq!(char_count("你好"), 2);
    assert_eq!(char_count("A🦀"), 2);
// endregion:tests
    println!("__PASS__");
}
