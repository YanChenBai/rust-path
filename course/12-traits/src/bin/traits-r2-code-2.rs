// region:answer
fn to_byte(n: u32) -> Result<u8, String> {
    match u8::try_from(n) {
        Ok(n) => Ok(n),
        Err(_) => Err(String::from("range")),
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(to_byte(0), Ok(0));
    assert_eq!(to_byte(255), Ok(255));
    assert_eq!(to_byte(256), Err(String::from("range")));
// endregion:tests
    println!("__PASS__");
}
