// region:answer
fn nonzero(value: Option<u32>) -> bool {
    match value {
        Some(n) => n > 0,
        None => false,
    }
}
// endregion:answer

fn main() {
// region:tests
assert!(nonzero(Some(1)));
    assert!(!nonzero(Some(0)));
    assert!(!nonzero(None));
// endregion:tests
    println!("__PASS__");
}
