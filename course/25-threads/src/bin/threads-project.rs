// region:answer
fn stats(values: &[i32]) -> (usize, i64) {
    fn part(v: &[i32]) -> (usize, i64) {
        (
            v.iter().filter(|&&n| n > 0).count(),
            v.iter().map(|&n| i64::from(n)).sum(),
        )
    }
    std::thread::scope(|s| {
        let mid = values.len() / 2;
        let a = s.spawn(move || part(&values[..mid]));
        let b = s.spawn(move || part(&values[mid..]));
        let a = a.join().unwrap();
        let b = b.join().unwrap();
        (a.0 + b.0, a.1 + b.1)
    })
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(stats(&[-2,0,3,4,5]),(3,10));assert_eq!(stats(&[]),(0,0));assert_eq!(stats(&[i32::MAX,i32::MAX]),(2,4294967294));
// endregion:tests
    println!("__PASS__");
}
