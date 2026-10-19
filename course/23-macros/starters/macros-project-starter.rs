macro_rules! settings {
    ($($key:expr => $value:expr),* $(,)?) => {{ todo!() }};
}

fn main() {
    let map: std::collections::BTreeMap<String, i32> = settings!("limit" => 3);
    println!("{map:?}");
}
