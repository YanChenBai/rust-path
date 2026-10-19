fn main() {
    // mut 修改同一个绑定，遮蔽则创建一个新的同名绑定。

    let mut steps = 1;
    steps += 1;

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("已走出 {steps} 步");
    let steps = "继续前进";
    println!("{steps}");
}
