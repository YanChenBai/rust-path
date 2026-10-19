// 独立 Cargo 工程可在 Cargo.toml 中声明：
// [features]
// default = []
// compact = []
fn mode() -> &'static str {
    if cfg!(debug_assertions) {
        "debug"
    } else {
        "optimized"
    }
}

fn main() {
    // 保存这一阶段返回的结果，后续检查它的实际内容或成功状态。
    let result = 21u32.checked_mul(2);

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(result, Some(42));

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!(
        "模式：{}；验证：cargo check / cargo build / cargo test",
        mode()
    );
}
