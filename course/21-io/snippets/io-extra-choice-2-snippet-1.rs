use std::io::{BufRead, Cursor};
let mut source = Cursor::new("a\nb\n");
let mut line = String::new();
