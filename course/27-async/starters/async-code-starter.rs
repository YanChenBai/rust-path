async fn doubled(values: Vec<u32>) -> Vec<u64> {
    todo!()
}

fn main() {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    println!("{:?}", runtime.block_on(doubled(vec![1, 2])));
}
