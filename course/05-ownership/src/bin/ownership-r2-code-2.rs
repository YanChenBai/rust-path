// region:answer
fn duplicate(text: String) -> (String, String) {
    (text.clone(), text)
}
// endregion:answer

fn main() {
// region:tests
let (mut a, b) = duplicate(String::from("a"));
    a.push('b');
    assert_eq!(a, "ab");
    assert_eq!(b, "a");
    let (a, b) = duplicate(String::new());
    assert!(a.is_empty() && b.is_empty());
// endregion:tests
    println!("__PASS__");
}
