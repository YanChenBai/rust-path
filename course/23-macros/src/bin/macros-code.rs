// region:answer
macro_rules! total_i64 {
    ($($value:expr),* $(,)?) => {{
        let mut total = 0i64;
        $(total += i64::from($value);)*
        total
    }};
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(total_i64!(), 0i64);
    assert_eq!(total_i64!(1, -2, 4,), 3);
    let mut calls = 0;
    assert_eq!(
        total_i64!(
            {
                calls += 1;
                7
            },
            {
                calls += 1;
                2
            }
        ),
        9
    );
    assert_eq!(calls, 2);
    assert_eq!(total_i64!(i32::MAX, i32::MAX), 4294967294);
    // endregion:tests
    println!("__PASS__");
}
