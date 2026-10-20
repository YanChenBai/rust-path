let response = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
let status = response.lines().next().unwrap().split_whitespace().nth(1).unwrap();
println!("{status}");
