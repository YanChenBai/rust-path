// region:answer
fn totals(values: &[(&str, u32)]) -> std::collections::HashMap<String, u64> {
    let mut out = std::collections::HashMap::new();
    for &(name, n) in values {
        *out.entry(name.to_owned()).or_insert(0) += u64::from(n);
    }
    out
}
// endregion:answer

fn main() {
// region:tests
let r = totals(&[("甲", u32::MAX), ("甲", 2), ("乙", 0)]);
    assert_eq!(r["甲"], 4294967297);
    assert_eq!(r["乙"], 0);
    assert!(totals(&[]).is_empty());
// endregion:tests
    println!("__PASS__");
}
