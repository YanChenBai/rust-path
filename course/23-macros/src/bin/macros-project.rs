// region:answer
macro_rules! settings {
    ($($key:expr => $value:expr),* $(,)?) => {{
        let mut result = std::collections::BTreeMap::<String, i32>::new();
        $(
            let key = String::from($key);
            let value: i32 = $value;
            result.insert(key, value);
        )*
        result
    }};
}
// endregion:answer

fn main() {
    // region:tests
    assert!(settings!().is_empty());
    let map = settings!("b" => 2, "a" => 1, "b" => 3,);
    assert_eq!(
        map.into_iter().collect::<Vec<_>>(),
        vec![("a".into(), 1), ("b".into(), 3)]
    );
    let mut calls = 0;
    let key = String::from("中文");
    let map = settings!(&key => { calls += 1; 9 });
    assert_eq!(calls, 1);
    assert_eq!(map["中文"], 9);
    assert_eq!(key, "中文");
    // endregion:tests
    println!("__PASS__");
}
