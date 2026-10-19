// region:answer
mod math {
    pub fn checked_double(n: u32) -> Option<u32> { n.checked_mul(2) }
}
pub fn run(n: u32) -> Option<u32> { crate::math::checked_double(n) }
// endregion:answer

fn main() {
// region:tests
assert_eq!(run(0), Some(0)); assert_eq!(run(7), Some(14));
assert_eq!(run(u32::MAX), None); assert_eq!(run(u32::MAX / 2), Some(u32::MAX - 1));
// endregion:tests
    println!("__PASS__");
}
