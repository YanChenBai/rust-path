// region:answer
fn move_text(text: String) -> String {
    text
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(move_text(String::from("你好")), "你好");
    assert_eq!(move_text(String::new()), "");
// endregion:tests
    println!("__PASS__");
}
