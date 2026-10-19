---
id: module-visibility
title: 从私有实现到公开接口
subtitle: 模块边界决定谁能命名和构造一个类型。
minutes: 16
type: lesson
chapterId: modules
order: 0
---

## 模块边界决定谁能命名和构造一个类型。

package 是 Cargo 管理的项目单位，crate 是编译单位，module 是 crate 内部的名称与可见性组织。一个 package 可以有库和多个二进制 crate。use 只引入已有路径的名字，不会让私有元素变公开，也不会像脚本语言那样按导入顺序执行文件。

模块中的内容默认私有。`pub` `struct` 不会自动公开字段；通过构造函数校验并保留私有字段，可以让非法状态无法从外部直接构造。`pub`(crate) 仅在当前 crate 可见，`pub`(super) 对父模块可见，应根据真实调用关系给最小范围。

下面用内联模块让浏览器中的单文件也能完整运行。正式多文件工程可把 mod domain 的内容放到 domain.rs，由模块声明加载；本节不假装已经创建了文件。练习通过公开函数验证接口，不依赖外部读取私有字段。

<CourseCallout>

路径可见与类型可见还不够：公开签名中涉及的类型也应有合适可见性。

</CourseCallout>

## 亲手试一试

```rust playground id=module-visibility
mod domain {
    pub struct Minutes(u32);
    impl Minutes {
        pub fn new(value: u32) -> Option<Self> {
            if value <= 180 {
                Some(Self(value))
            } else {
                None
            }
        }
        pub fn get(&self) -> u32 {
            self.0
        }
    }
}

fn main() {
    // 保存当前步骤得到的值，后续通过接口检查或转换。
    let value = domain::Minutes::new(25).unwrap();

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(value.get(), 25);
    assert!(domain::Minutes::new(181).is_none());
}
```

<CourseCallout title="给自己一个小挑战">

移除 new 的 `pub`，观察 `main` 无法访问；再把字段改为 `pub`，讨论会绕过什么校验。

</CourseCallout>
