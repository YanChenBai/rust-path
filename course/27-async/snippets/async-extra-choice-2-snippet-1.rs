let rt = tokio::runtime::Runtime::new().unwrap();
let total = rt.block_on(async { double(2).await + double(3).await });
println!("{total}"); 输出什么？
