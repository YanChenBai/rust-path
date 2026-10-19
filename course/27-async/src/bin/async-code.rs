// region:answer
async fn doubled(values: Vec<u32>) -> Vec<u64> {
    let mut jobs = Vec::new();
    for value in values { jobs.push(tokio::spawn(async move { u64::from(value) * 2 })); }
    let mut output = Vec::new();
    for job in jobs { output.push(job.await.expect("任务失败")); }
    output
}
// endregion:answer

fn main() {
// region:tests
let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
runtime.block_on(async {
    assert_eq!(doubled(vec![]).await, Vec::<u64>::new());
    assert_eq!(doubled(vec![3,0,2]).await, vec![6,0,4]);
    assert_eq!(doubled(vec![u32::MAX]).await, vec![8589934590]);
});
// endregion:tests
    println!("__PASS__");
}
