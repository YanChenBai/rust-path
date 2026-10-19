macro_rules! total_i64 {
    ($($value:expr),* $(,)?) => {{ todo!() }};
}

fn main() {
    let total: i64 = total_i64!(1, 2,);
    println!("{total}");
}
