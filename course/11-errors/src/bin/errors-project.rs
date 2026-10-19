// region:answer
fn import_minutes(input: &str) -> Result<Vec<u32>, String> {
    let mut out = Vec::new();
    for line in input.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let n = match line.parse::<u32>() {
            Ok(n) => n,
            Err(_) => return Err(String::from("invalid")),
        };
        if n == 0 || n > 180 {
            return Err(String::from("range"));
        }
        out.push(n);
    }
    Ok(out)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(import_minutes("25

 30"),Ok(vec![25,30]));assert!(import_minutes("20
x").is_err());assert!(import_minutes("0").is_err());assert!(import_minutes("181").is_err());assert_eq!(import_minutes(""),Ok(vec![]));
// endregion:tests
    println!("__PASS__");
}
