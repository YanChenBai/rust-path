// region:answer
fn optional_number(input: Option<&str>) -> Result<Option<u32>, String> {
    input
        .map(|s| s.parse::<u32>().map_err(|_| String::from("invalid")))
        .transpose()
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(optional_number(None), Ok(None));
    assert_eq!(optional_number(Some("0")), Ok(Some(0)));
    assert_eq!(optional_number(Some("x")), Err(String::from("invalid")));
// endregion:tests
    println!("__PASS__");
}
