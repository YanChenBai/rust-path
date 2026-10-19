// region:answer
fn withdraw(balance: &std::sync::Mutex<u32>, amount: u32) -> bool {
    let Ok(mut n) = balance.lock() else {
        return false;
    };
    if *n < amount {
        return false;
    }
    *n -= amount;
    true
}
// endregion:answer

fn main() {
// region:tests
let b = std::sync::Mutex::new(10);
    assert!(withdraw(&b, 7));
    assert!(!withdraw(&b, 4));
    assert_eq!(*b.lock().unwrap(), 3);
    assert!(withdraw(&b, 0));
// endregion:tests
    println!("__PASS__");
}
