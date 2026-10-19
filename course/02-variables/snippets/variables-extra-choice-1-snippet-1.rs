let minutes = " 90 ";
let minutes = minutes.trim().parse::<u32>().unwrap();
println!("{}:{}", minutes / 60, minutes % 60);
