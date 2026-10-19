// region:answer
fn profile(name: &str, days: u32) -> String { format!("{name} | Rust 第 {days} 天") }
// endregion:answer

fn main() {
// region:tests
assert_eq!(profile("小林", 1), "小林 | Rust 第 1 天"); assert_eq!(profile("Ada", 0), "Ada | Rust 第 0 天"); assert_eq!(profile("", 99), " | Rust 第 99 天");
// endregion:tests
    println!("__PASS__");
}
