// region:answer
async fn drain_sum(values: Vec<u32>) -> u64 {
    let (tx, mut rx) = tokio::sync::mpsc::channel::<u32>(1);
    let h = tokio::spawn(async move {
        let mut n = 0u64;
        while let Some(v) = rx.recv().await {
            n += u64::from(v);
        }
        n
    });
    for n in values {
        tx.send(n).await.unwrap();
    }
    drop(tx);
    h.await.unwrap()
}
// endregion:answer

fn main() {
// region:tests
let rt = tokio::runtime::Runtime::new().unwrap();
    assert_eq!(rt.block_on(drain_sum(vec![2, 3, u32::MAX])), 4294967300);
    assert_eq!(rt.block_on(drain_sum(vec![])), 0);
// endregion:tests
    println!("__PASS__");
}
