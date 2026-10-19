# Rust Path

以实践为中心的渐进式 Rust 教程，使用 Vue 3.6 RC、motion-v、Tailwind CSS 4、Monaco 与 Nitro v3。界面采用黑白主题，代码保留语法着色。

## 启动

```sh
vp install
vp run prepare:runtime
vp dev
```

打开终端显示的本地地址。完整模式需要本机安装 Rust stable、Cargo 和 rust-analyzer（可用 `rustup component add rust-analyzer` 安装）。首次使用依赖时 Cargo 需要下载 crate。服务只接受 localhost 和同源请求，面向本机学习，不适合作为公共代码执行服务部署。

## 学习流程

教材统一位于 `src/docs`，按章节拆分 Markdown；编写方法见 [教材编写](src/docs/README.md)。`src/components/docs` 封装文档交互组件，`src/components/learning` 与 `src/components/layout` 组织页面，`src/composables` 管理导航、搜索、统计和编辑器分栏。Markdown 按需编译加载，课程目录在构建时从同一份教材提取。

32 章、76 个知识点、256 道章节题和 32 个专项项目。覆盖基础语法、所有权、泛型与生命周期、智能指针、标准库、文件 I/O、Cargo、宏、线程与原子类型、异步、网络和常用依赖。

先阅读原理与对比示例，再进入“亲手试一试”。每章小试卷有 8 道题，每题独立提交、即时反馈；单题失败至少 3 次才允许主动查看解析。所有题目通过后解锁综合项目。编程题通过注入断言实际运行检查；前端判题用于自学，不提供防作弊保证。

资料以 [当前 Rust Book](https://doc.rust-lang.org/book/)、[Rust by Example](https://doc.rust-lang.org/rust-by-example/)、标准库和依赖官方文档为准。[中文旧译本](https://rustwiki.org/zh-CN/book/)仅参考讲解组织，不以其 Rust 1.58 作为语义标准。原生示例使用 Edition 2024，编译器版本取决于本机工具链。

## 课程主线

1. 基础表达：初识 Rust 与 Cargo、变量与类型、函数与表达式、分支与循环。
2. 数据与所有权：移动与复制、借用与引用、切片与 UTF-8、结构体、枚举、常用集合。
3. 可靠的抽象：Option/Result 基础、Trait 与转换、泛型、生命周期、闭包与迭代器、错误组合、模式进阶、dyn 接口。
4. 工程实践：模块与可见性、测试与调试、文件与 I/O、Cargo/Workspace 构建、宏与属性。
5. 资源与并发：智能指针、线程与消息、共享状态、Future/Tokio、取消与背压。
6. 应用能力：序列化/CLI/日志、TCP/UDP、HTTP、SQLite/事务。最后的完整示例串联本机 HTTP 与文件数据库，关闭连接后重新打开验证持久化。

新增章采用独立题目和真实断言；第一章提供函数与类型辅助骨架，避免要求先掌握后续章节。Unsafe/FFI、过程宏编写、性能分析与 WebAssembly 作为后续选修方向，尚未列入这 32 章。

当前实验室仍以单个 main.rs 加受控 Cargo.toml 为运行单元。模块例子可用内联模块真实运行，Workspace 的多文件结构在文档中讲解；尚未提供任意文件树与多 crate 项目的编辑执行。HTTP 协议示例是有限的本机实验，不代替生产服务框架。

## 编辑与执行

- 完整模式：Nitro 调用本机 Cargo 和 rust-analyzer，提供补全、悬浮说明、实时编译诊断以及 run/check/build/test。
- main.rs 与 Cargo.toml 使用文件标签切换。TOML 支持语法高亮，依赖通过行尾勾选框管理；依赖范围为教程中预设的常用 crate。
- 编辑器和终端支持上下、左右布局、拖拽分隔线、网页全屏（Esc 退出）和专注模式。
- 章节笔记通过右下角悬浮入口打开，支持 Markdown 查看、编辑和自动保存。升级时会按章节汇总原有课时笔记。
- 阅读正文时选中文字可添加 Markdown 注释，原文末尾显示摘要胶囊，悬停展开全文；可以在本章注释列表中查看、修改或删除。定位使用引文、上下文与原始偏移，刷新后会恢复；若原文已删除，注释仍保留在列表中。笔记和注释随浏览器记录一起导出、导入。
- 编辑器工具栏可隐藏/显示 Rust 注释，按编辑器保存偏好。独立注释行从视图折叠，行尾注释隐藏；原始源码、行号、编译输入和草稿保留，字符串中的 `//` 不受影响。
- 终端支持 ANSI 颜色，按进程输出到达的顺序增量显示。程序自身的输出缓冲仍需通过换行或 flush 控制。
- 无本机服务时使用浏览器 WASM Miri 与历史实验版 rust-analyzer 作为基础语法回退。回退不支持外部 crate、原生线程、系统网络或完整 Cargo 工程，也不能保证最新 Rust 语义分析完整。

工具链资源由准备脚本生成到 public/runtime。浏览器回退首次加载较大，使用 Cache Storage 缓存。不承诺完整离线 PWA。

## 浏览器持久化

当前 origin 的 localStorage 保存草稿、答案、失败次数、进度、笔记、输出、依赖、布局、分隔比例和专注状态。课程重组保留已有知识点 ID、草稿、笔记和未改写题目的通过记录；已换题的旧成绩存入 archivedPassed，不自动视作新题通过。不同浏览器、端口不自动共享；清理站点数据会删除记录。学习足迹支持 JSON 导出与导入，导入会替换当前记录。

## 验证与构建

```sh
vp check
vp run type-check
vp test
vp run verify:course
vp run build
```

课程验证脚本实际编译并执行示例及编程参考实现，需要本机 Rust 工具链。构建产生 Nitro 的 `.output/`，运行 `node .output/server/index.mjs` 启动完整服务。纯静态托管仅具备浏览器回退能力。

浏览器 WASM 分析需要 HTTPS（localhost 除外）及以下响应头，开发服务已配置：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

大型生成资源不提交 Git，来源与许可见 THIRD_PARTY_NOTICES.md。
