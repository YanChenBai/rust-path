// region:answer
fn concurrent_count(workers: usize, each: usize) -> usize {
    use std::sync::{Arc, Mutex};
    let n = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();
    for _ in 0..workers {
        let n = Arc::clone(&n);
        handles.push(std::thread::spawn(move || {
            for _ in 0..each {
                *n.lock().unwrap() += 1;
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
    let total = *n.lock().unwrap();
    total
}
// endregion:answer

fn main() {
// region:tests
assert_eq!(concurrent_count(4, 200), 800);
    assert_eq!(concurrent_count(0, 20), 0);
    assert_eq!(concurrent_count(2, 0), 0);
// endregion:tests
    println!("__PASS__");
}
