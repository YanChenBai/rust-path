async fn batch_total(inputs: &[&str]) -> Result<u32, String> {
    todo!()
}

fn main() {
    let rt = tokio::runtime::Runtime::new().unwrap();
    println!("{:?}", rt.block_on(batch_total(&["20", " 5 "])));
}
