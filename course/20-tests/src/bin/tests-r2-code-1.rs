// region:answer
fn pages(items: u32, size: u32) -> Option<u32> {
    if size == 0 {
        None
    } else {
        Some(items / size + u32::from(items % size != 0))
    }
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(pages(0, 10), Some(0));
    assert_eq!(pages(10, 10), Some(1));
    assert_eq!(pages(11, 10), Some(2));
    assert_eq!(pages(u32::MAX, 2), Some(2147483648));
    assert_eq!(pages(1, 0), None);
// endregion:tests
    println!("__PASS__");
}
