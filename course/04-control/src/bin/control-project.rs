// region:answer
fn weekly_xp(minutes: &[u32]) -> u32 { let mut xp = 0; let mut active = 0; for &n in minutes { if n >= 15 { active += 1; } xp += match n { 0..=14 => 0, 15..=29 => 10, _ => 25 }; } if active >= 5 { xp += 50; } xp }
// endregion:answer

fn main() {
// region:tests
assert_eq!(weekly_xp(&[]),0); assert_eq!(weekly_xp(&[14,15,29,30]),45); assert_eq!(weekly_xp(&[30,20,10,45,15,30,0]),145); assert_eq!(weekly_xp(&[15;5]),100); assert_eq!(weekly_xp(&[30;7]),225);
// endregion:tests
    println!("__PASS__");
}
