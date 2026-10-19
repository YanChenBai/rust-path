// region:answer
fn parse_optional(input: Option<&str>) -> Option<u32> {
    input.and_then(|s| s.trim().parse().ok()).filter(|&n| n > 0)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(parse_optional(Some(" 7 ")), Some(7));
    assert_eq!(parse_optional(Some("0")), None);
    assert_eq!(parse_optional(Some("bad")), None);
    assert_eq!(parse_optional(None), None);
// endregion:tests
    println!("__PASS__");
}
