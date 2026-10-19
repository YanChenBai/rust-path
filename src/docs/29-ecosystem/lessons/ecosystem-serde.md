---
id: ecosystem-serde
title: serde 与 serde_json
subtitle: 结构正确之后还要检查业务约束
minutes: 18
nativeRequired: true
dependencies:
  - serde
  - serde_json
type: lesson
chapterId: ecosystem
order: 0
---

## 序列化定义数据形状，不替代领域验证。

serde 通过 Serialize 和 Deserialize `trait` 把 Rust 数据模型与具体格式分开，serde_json 则提供 JSON 编解码。启用 serde 的 derive 功能后，可以用派生减少结构体字段映射的样板。to_string 返回 JSON 字符串，from_str 根据目标类型解析，类型缺失或不匹配会报错；这与手工读取 Value 再到处做字符串索引是不同层次的接口。

结构体能成功反序列化，不代表数据满足业务要求。例如 `u32` 允许零，但学习分钟数可能必须在一到一百八十之间。需要在解析后继续校验名字、范围和跨字段关系。deny_unknown_fields 可以拒绝意外字段，适合严格配置；面对需要前向兼容的外部协议，则应根据需求选择是否容忍未知字段，不能把严格模式当作唯一正确方案。

错误信息应保留上下文，不能把所有解析失败都替换成没有来源的“失败”。测试应比较解析后的数据或 Value，不依赖 JSON 对象字段打印顺序。`Option` 字段、默认值与 rename 等属性还能表达协议演化，但要先写明缺省语义。示例只处理本地字符串，不需要公网；运行器已提供 serde 的 derive 与 serde_json 依赖，完整 `main` 会验证中文与一次往返转换。

<CourseCallout>

JSON 数字与 Rust 整数范围不同；反序列化为 `u32` 可以拒绝负数和超范围值。

</CourseCallout>

## 亲手试一试

```rust playground id=ecosystem-serde
#[derive(serde::Serialize, serde::Deserialize, Debug, PartialEq)]
#[serde(deny_unknown_fields)]

struct Record {
    name: String,
    minutes: u32,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 保存当前步骤得到的值，后续通过接口检查或转换。
    let value: Record = serde_json::from_str(r#"{"name":"小林","minutes":25}"#)?;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert!(!value.name.trim().is_empty());
    assert!((1..=180).contains(&value.minutes));

    // 保存序列化后的 JSON 文本，便于输出或再次解析验证。
    let json = serde_json::to_string(&value)?;
    assert_eq!(serde_json::from_str::<Record>(&json)?, value);

    // 输出当前值以便观察；打印本身不等于创建一份拥有的字符串副本。
    println!("{json}");
    Ok(())
}
```

<CourseCallout title="给自己一个小挑战">

增加未知字段和缺失字段输入，再根据协议目标决定是否保留 deny_unknown_fields。

</CourseCallout>
