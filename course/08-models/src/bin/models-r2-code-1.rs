// region:answer
struct Rectangle {
    width: u32,
    height: u32,
}
impl Rectangle {
    fn area(&self) -> u64 {
        u64::from(self.width) * u64::from(self.height)
    }
}
// endregion:answer

fn main() {
// region:tests
let r = Rectangle {
        width: u32::MAX,
        height: 2,
    };
    assert_eq!(r.area(), 8589934590);
    assert_eq!(
        Rectangle {
            width: 0,
            height: 4
        }
        .area(),
        0
    );
// endregion:tests
    println!("__PASS__");
}
