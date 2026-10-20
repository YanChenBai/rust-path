let minutes = 30;
let xp = match minutes {
    0..=14 => 0,
    15..=29 => 10,
    _ => 25,
};
println!("{xp}");
