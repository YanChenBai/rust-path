// region:answer
mod domain {
    pub fn clamp(n: u32) -> u32 {
        n.min(180)
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(domain::clamp(0), 0);
    assert_eq!(domain::clamp(180), 180);
    assert_eq!(domain::clamp(u32::MAX), 180);
// endregion:tests
    println!("__PASS__");
}
