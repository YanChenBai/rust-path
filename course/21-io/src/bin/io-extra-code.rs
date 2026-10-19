// region:answer
fn count_records<R: std::io::BufRead>(reader: R) -> std::io::Result<usize> {
    let mut count = 0;
    for line in reader.lines() {
        let line = line?;
        let line = line.trim();
        if !line.is_empty() && !line.starts_with('#') {
            count += 1;
        }
    }
    Ok(count)
}
// endregion:answer

fn main() {
// region:tests
use std::io::{self, Cursor};
assert_eq!(count_records(Cursor::new("")).unwrap(), 0);
assert_eq!(count_records(Cursor::new(" # config\n \t\n")).unwrap(), 0);
assert_eq!(count_records(Cursor::new("# config\r\nport=80\r\nname=小林\n")).unwrap(), 2);
assert_eq!(count_records(Cursor::new("value=#tag\n final")).unwrap(), 2);
let invalid_utf8 = count_records(Cursor::new(vec![b'a', b'\n', 0xff]));
assert_eq!(invalid_utf8.unwrap_err().kind(), io::ErrorKind::InvalidData);
struct Broken;
impl io::Read for Broken {
    fn read(&mut self, _: &mut [u8]) -> io::Result<usize> {
        Err(io::Error::new(io::ErrorKind::PermissionDenied, "blocked"))
    }
}
impl io::BufRead for Broken {
    fn fill_buf(&mut self) -> io::Result<&[u8]> {
        Err(io::Error::new(io::ErrorKind::PermissionDenied, "blocked"))
    }
    fn consume(&mut self, _: usize) {}
}
let error = count_records(Broken).unwrap_err();
assert_eq!(error.kind(), io::ErrorKind::PermissionDenied);
assert_eq!(error.to_string(), "blocked");
// endregion:tests
    println!("__PASS__");
}
