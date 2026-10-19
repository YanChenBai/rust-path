let response = "HTTP/1.1 200 OK\r\nX-Test: 1\r\n";
let first = response.lines().____().unwrap();
assert_eq!(first, "HTTP/1.1 200 OK");
