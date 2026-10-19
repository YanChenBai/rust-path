// region:answer
fn prefix(text: &str, count: usize) -> String {
    text.chars().take(count).collect()
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(prefix("你好Rust", 2), "你好");
    assert_eq!(prefix("🦀a", 1), "🦀");
    assert_eq!(prefix("a", 8), "a");
    assert_eq!(prefix("abc", 0), "");
// endregion:tests
    println!("__PASS__");
}
