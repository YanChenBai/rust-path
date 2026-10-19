// region:answer
fn state_label(value: Option<u32>) -> String {
    match value {
        Some(n) => format!("ready:{n}"),
        None => String::from("pending"),
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(state_label(Some(0)), "ready:0");
    assert_eq!(state_label(Some(8)), "ready:8");
    assert_eq!(state_label(None), "pending");
// endregion:tests
    println!("__PASS__");
}
