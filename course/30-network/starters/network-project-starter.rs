fn local_http(body: &str) -> std::io::Result<String> {
    todo!()
}

fn main() -> std::io::Result<()> {
    println!("{}", local_http("你好")?);
    Ok(())
}
