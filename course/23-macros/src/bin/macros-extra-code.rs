// region:answer
macro_rules! labels {
    ($($value:expr),* $(,)?) => {{
        let result: Vec<String> = vec![$(format!("{}", $value)),*];
        result
    }};
}

fn sample_labels() -> Vec<String> {
    labels!("Rust", 2024)
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(sample_labels(), vec!["Rust", "2024"]);
assert_eq!(labels!(), Vec::<String>::new());
assert_eq!(labels!(""), vec![""]);
assert_eq!(labels!("学习", -1, true,), vec!["学习", "-1", "true"]);
let mut calls = 0;
let result = labels!({ calls += 1; calls }, { calls += 1; calls });
assert_eq!(calls, 2);
assert_eq!(result, vec!["1", "2"]);
assert_eq!(labels!(String::from("🦀")), vec!["🦀"]);
let owned = String::from("保留");
assert_eq!(labels!(&owned), vec!["保留"]);
assert_eq!(owned, "保留");
// endregion:tests
    println!("__PASS__");
}
