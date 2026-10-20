// region:answer
async fn pipeline(values: Vec<u32>) -> Vec<u64> {
    let (tx, mut rx) = tokio::sync::mpsc::channel::<u32>(2);
    let h = tokio::spawn(async move {
        let mut out = Vec::new();
        while let Some(n) = rx.recv().await {
            out.push(u64::from(n) * 2);
        }
        out
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
    assert_eq!(
        rt.block_on(pipeline(vec![3, 1, u32::MAX])),
        vec![6, 2, 8589934590]
    );
    assert!(rt.block_on(pipeline(vec![])).is_empty());
    // endregion:tests
    println!("__PASS__");
}
