// region:answer
async fn batch_total(inputs: &[&str]) -> Result<u32, String> {
    async fn parse_record(input: &str) -> Result<u32, String> {
        input.trim().parse::<u32>().map_err(|_| "无效记录".to_string())
    }

    let mut total = 0u32;
    for &input in inputs {
        let value = parse_record(input).await?;
        total = total.checked_add(value).ok_or_else(|| "总和溢出".to_string())?;
    }
    Ok(total)
}
// endregion:answer

fn main() {
// region:tests
let rt = tokio::runtime::Runtime::new().unwrap();
assert_eq!(rt.block_on(batch_total(&[])), Ok(0));
assert_eq!(rt.block_on(batch_total(&["20", " 5 "])), Ok(25));
assert_eq!(rt.block_on(batch_total(&["0", "+1", "0002"])), Ok(3));
assert_eq!(rt.block_on(batch_total(&["4294967295", "0"])), Ok(u32::MAX));
assert_eq!(rt.block_on(batch_total(&["4294967295", "1"])), Err("总和溢出".into()));
for input in ["", " ", "abc", "-1", "1.5", "4294967296"] {
    assert_eq!(rt.block_on(batch_total(&["1", input])), Err("无效记录".into()));
}
assert_eq!(rt.block_on(batch_total(&["bad", "4294967295", "1"])), Err("无效记录".into()));
// endregion:tests
    println!("__PASS__");
}
