// region:answer
fn parse_limit(input: &str) -> Result<u32, String> {
    let n = match input.trim().parse::<u32>() {
        Ok(n) => n,
        Err(_) => return Err(String::from("format")),
    };
    if n == 0 || n > 180 {
        Err(String::from("range"))
    } else {
        Ok(n)
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(parse_limit(" 25 "), Ok(25));
    assert_eq!(parse_limit("0"), Err(String::from("range")));
    assert_eq!(parse_limit("181"), Err(String::from("range")));
    assert_eq!(parse_limit("x"), Err(String::from("format")));
// endregion:tests
    println!("__PASS__");
}
