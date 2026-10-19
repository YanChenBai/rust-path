// region:answer
fn find_line<'a>(input: &'a str, needle: &str) -> Option<&'a str> {
    input
        .lines()
        .map(str::trim)
        .find(|line| !line.is_empty() && line.contains(needle))
}
// endregion:answer

fn main() {
// region:tests
let input=String::from("
 hello 
 你好 Rust
");let line=find_line(&input,"Rust").unwrap();assert_eq!(line,"你好 Rust");assert_eq!(find_line(&input,""),Some("hello"));assert_eq!(find_line(&input,"missing"),None);let p=line.as_ptr() as usize;let start=input.as_ptr() as usize;assert!(p>=start&&p+line.len()<=start+input.len());
// endregion:tests
    println!("__PASS__");
}
