// region:answer
fn relay(values: Vec<String>) -> Vec<String> {
    let (tx, rx) = std::sync::mpsc::channel();
    let h = std::thread::spawn(move || {
        for v in values {
            tx.send(v).unwrap();
        }
    });
    let out = rx.into_iter().collect();
    h.join().unwrap();
    out
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(
        relay(vec![String::from("甲"), String::from("乙")]),
        vec!["甲", "乙"]
    );
    assert!(relay(vec![]).is_empty());
// endregion:tests
    println!("__PASS__");
}
