// region:answer
fn classify(value: Option<u32>) -> &'static str {
    match value {
        None => "missing",
        Some(0) => "zero",
        Some(1..=180) => "valid",
        _ => "range",
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(classify(None), "missing");
    assert_eq!(classify(Some(0)), "zero");
    assert_eq!(classify(Some(180)), "valid");
    assert_eq!(classify(Some(181)), "range");
// endregion:tests
    println!("__PASS__");
}
