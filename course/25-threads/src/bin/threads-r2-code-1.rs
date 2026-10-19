// region:answer
fn parallel_sum(values: &[i32]) -> i64 {
    std::thread::scope(|s| {
        let mid = values.len() / 2;
        let a =
            s.spawn(move || values[..mid].iter().map(|&n| i64::from(n)).sum::<i64>());
        let b =
            s.spawn(move || values[mid..].iter().map(|&n| i64::from(n)).sum::<i64>());
        a.join().unwrap() + b.join().unwrap()
    })
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(parallel_sum(&[1, 2, 3]), 6);
    assert_eq!(parallel_sum(&[]), 0);
    assert_eq!(parallel_sum(&[i32::MAX, i32::MAX]), 4294967294);
// endregion:tests
    println!("__PASS__");
}
