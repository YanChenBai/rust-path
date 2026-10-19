macro_rules! labels {
    // 匹配零个或多个表达式，允许尾逗号
    ($($value:expr),* $(,)?) => {{ todo!() }};
}

fn sample_labels() -> Vec<String> {
    todo!()
}

fn main() {
    println!("{:?}", sample_labels());
}
