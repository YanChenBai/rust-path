// region:answer
#[derive(Debug, PartialEq)]
struct Minutes(u32);
impl TryFrom<u32> for Minutes {
    type Error = String;
    fn try_from(n: u32) -> Result<Self, String> {
        if (1..=180).contains(&n) {
            Ok(Self(n))
        } else {
            Err(String::from("range"))
        }
    }
}
impl From<Minutes> for u32 {
    fn from(n: Minutes) -> Self {
        n.0
    }
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(Minutes::try_from(0), Err(String::from("range")));
    assert_eq!(Minutes::try_from(181), Err(String::from("range")));
    assert_eq!(u32::from(Minutes::try_from(180).unwrap()), 180);
    // endregion:tests
    println!("__PASS__");
}
