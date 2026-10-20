// region:answer
fn summarize_file(input: &std::path::Path, output: &std::path::Path) -> std::io::Result<usize> {
    use std::io::{BufRead, Write};
    if input == output {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "输入输出路径相同",
        ));
    }
    let reader = std::io::BufReader::new(std::fs::File::open(input)?);
    let mut count = 0;
    for line in reader.lines() {
        if !line?.trim().is_empty() {
            count += 1;
        }
    }
    let mut writer = std::io::BufWriter::new(std::fs::File::create(output)?);
    writeln!(writer, "lines={count}")?;
    writer.flush()?;
    Ok(count)
}
// endregion:answer

fn main() {
    // region:tests
    let dir = std::env::temp_dir().join(format!(
        "rust-io-{}-{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    std::fs::create_dir(&dir).unwrap();
    let input = dir.join("输入.txt");
    let output = dir.join("统计.txt");
    std::fs::write(&input, "甲\n \n乙\r\n").unwrap();
    assert_eq!(summarize_file(&input, &output).unwrap(), 2);
    assert_eq!(std::fs::read_to_string(&output).unwrap(), "lines=2\n");
    assert!(summarize_file(&input, &input).is_err());
    std::fs::write(&input, "").unwrap();
    assert_eq!(summarize_file(&input, &output).unwrap(), 0);
    assert!(summarize_file(&dir.join("missing"), &output).is_err());
    std::fs::remove_dir_all(dir).unwrap();
    // endregion:tests
    println!("__PASS__");
}
