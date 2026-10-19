// region:answer
fn sum_lines<R: std::io::BufRead>(reader: R) -> Result<i64, String> {
    let mut sum = 0i64;
    for line in reader.lines() {
        let line = line.map_err(|e| e.to_string())?;
        if line.trim().is_empty() { continue; }
        let n: i64 = line.trim().parse::<i64>().map_err(|e| e.to_string())?;
        sum = sum.checked_add(n).ok_or("总和溢出")?;
    }
    Ok(sum)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(sum_lines(std::io::Cursor::new("1\n -2\n3\n")), Ok(2));
assert_eq!(sum_lines(std::io::Cursor::new(" \r\n")), Ok(0));
assert!(sum_lines(std::io::Cursor::new("1\nabc")).is_err());
assert!(sum_lines(std::io::Cursor::new("9223372036854775807\n1")).is_err());
// endregion:tests
    println!("__PASS__");
}
