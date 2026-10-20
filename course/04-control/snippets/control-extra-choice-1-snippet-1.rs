let mut score = 0;
for day in 1..=5 {
    if day == 3 {
        continue;
    }
    score += day;
}
println!("{score}");
