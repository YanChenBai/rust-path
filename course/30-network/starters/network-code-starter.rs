fn tcp_echo(payload: &[u8]) -> std::io::Result<Vec<u8>> {
    todo!()
}

fn main() -> std::io::Result<()> {
    assert_eq!(tcp_echo(b"hi")?, b"hi");
    Ok(())
}
