// region:answer
fn sell(stock: u32, requests: Vec<u32>) -> (u32, usize) {
    use std::sync::{Arc, Mutex};
    let shared = Arc::new(Mutex::new((stock, 0)));
    let handles: Vec<_> = requests
        .into_iter()
        .map(|n| {
            let shared = Arc::clone(&shared);
            std::thread::spawn(move || {
                let mut s = shared.lock().unwrap();
                if s.0 >= n {
                    s.0 -= n;
                    s.1 += 1;
                }
            })
        })
        .collect();
    for h in handles {
        h.join().unwrap();
    }
    let result = *shared.lock().unwrap();
    result
}
// endregion:answer

fn main() {
    // region:tests
    assert_eq!(sell(20, vec![3, 4, 5]), (8, 3));
    assert_eq!(sell(1, vec![2, 3]), (1, 0));
    assert_eq!(sell(0, vec![0, 0]), (0, 2));
    assert_eq!(sell(7, vec![]), (7, 0));
    let (left, count) = sell(10, vec![7, 7]);
    assert_eq!((left, count), (3, 1));
    // endregion:tests
    println!("__PASS__");
}
