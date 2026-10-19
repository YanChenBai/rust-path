// region:answer
async fn race_or_cancel(cancel: bool) -> Result<u32, &'static str> {
    let (sender, mut receiver) = tokio::sync::oneshot::channel::<u32>();
    let mut job = tokio::spawn(async move {
        let _sender = sender;
        std::future::pending::<()>().await;
    });
    let result = tokio::select! {
        biased;
        _ = std::future::ready(()), if cancel => Err("cancelled"),
        value = &mut receiver => value.map_err(|_| "closed"),
        value = async { tokio::task::yield_now().await; 7u32 } => Ok(value),
    };
    job.abort();
    let error = (&mut job).await.expect_err("任务应被取消");
    assert!(error.is_cancelled());
    result
}
// endregion:answer

fn main() {
// region:tests
let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
runtime.block_on(async {
    assert_eq!(race_or_cancel(true).await, Err("cancelled"));
    assert_eq!(race_or_cancel(false).await, Ok(7));
    assert_eq!(race_or_cancel(true).await, Err("cancelled"));
    assert_eq!(race_or_cancel(false).await, Ok(7));
});
// endregion:tests
    println!("__PASS__");
}
