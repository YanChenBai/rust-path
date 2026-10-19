// region:answer
fn transfer(from: &mut u32, to: &mut u32, amount: u32) -> bool {
    if *from < amount {
        return false;
    }
    if let Some(next) = to.checked_add(amount) {
        *from -= amount;
        *to = next;
        true
    } else {
        false
    }
}
// endregion:answer

fn main() {
// region:tests
let(mut a,mut b)=(20,5);assert!(transfer(&mut a,&mut b,7));assert_eq!((a,b),(13,12));assert!(!transfer(&mut a,&mut b,14));assert_eq!((a,b),(13,12));assert!(transfer(&mut a,&mut b,0));let(mut a,mut b)=(1,u32::MAX);assert!(!transfer(&mut a,&mut b,1));assert_eq!((a,b),(1,u32::MAX));
// endregion:tests
    println!("__PASS__");
}
