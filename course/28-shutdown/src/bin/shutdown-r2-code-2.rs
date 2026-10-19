// region:answer
async fn stopped() -> bool {
    let (tx, rx) = tokio::sync::oneshot::channel();
    let h = tokio::spawn(async move { rx.await.is_ok() });
    tx.send(()).unwrap();
    h.await.unwrap()
}
// endregion:answer

fn main() {
// region:tests
let rt = tokio::runtime::Runtime::new().unwrap();
    assert!(rt.block_on(stopped()));
// endregion:tests
    println!("__PASS__");
}
