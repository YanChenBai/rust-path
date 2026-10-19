// region:answer
fn checkin(name: &str, day: u32) -> String {
    format!("{name}：第 {day} 天")
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(checkin("Ada", 2), "Ada：第 2 天");
assert_eq!(checkin("小林", 0), "小林：第 0 天");
assert_eq!(checkin("", 1), "：第 1 天");
assert_eq!(checkin(" Ada ", 10), " Ada ：第 10 天");
assert_eq!(checkin("🦀", u32::MAX), "🦀：第 4294967295 天");
// endregion:tests
    println!("__PASS__");
}
