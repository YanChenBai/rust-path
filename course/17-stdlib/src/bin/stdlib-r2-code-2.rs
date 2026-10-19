// region:answer
fn take_nonempty(value: &mut Option<String>) -> Option<String> {
    match value {
        Some(s) if !s.is_empty() => value.take(),
        _ => None,
    }
}
// endregion:answer

fn main() {
// region:tests
let mut v = Some(String::from("a"));
    assert_eq!(take_nonempty(&mut v), Some(String::from("a")));
    assert!(v.is_none());
    let mut v = Some(String::new());
    assert!(take_nonempty(&mut v).is_none());
    assert_eq!(v, Some(String::new()));
// endregion:tests
    println!("__PASS__");
}
