use std::io::{BufRead, Cursor};
let lines: Vec<_> = Cursor::new("port=80\r\n\n").lines().collect::<Result<_, _>>().unwrap();
println!("{lines:?}"); 输出什么？
