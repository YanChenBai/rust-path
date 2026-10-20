// region:answer
fn parse_rows(input: &str) -> Result<Vec<u32>, String> {
    input
        .lines()
        .enumerate()
        .filter(|(_, s)| !s.trim().is_empty())
        .map(|(i, s)| {
            s.trim()
                .parse::<u32>()
                .map_err(|_| format!("line:{}", i + 1))
        })
        .collect()
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(
        parse_rows(
            "1

 0
2"
        ),
        Ok(vec![1, 0, 2])
    );
    assert_eq!(
        parse_rows(
            "
1
x
y"
        ),
        Err(String::from("line:3"))
    );
    assert_eq!(parse_rows(""), Ok(vec![]));
    // endregion:tests
    println!("__PASS__");
}
