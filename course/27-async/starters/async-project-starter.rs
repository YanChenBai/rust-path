async fn race_or_cancel(cancel: bool) -> Result<u32, &'static str> {
    todo!()
}

fn main() {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    println!("{:?}", runtime.block_on(race_or_cancel(true)));
}
