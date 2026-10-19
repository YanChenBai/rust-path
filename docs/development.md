# 开发指南

[返回项目首页](../README.md) · [学习指南](learning.md) · [教材编写](../src/docs/README.md)

## 基础依赖

安装 [Vite+](https://viteplus.dev/) 和 [Rust](https://www.rust-lang.org/tools/install)（通过 rustup 安装 stable 工具链）即可。Node.js 运行时与 pnpm 由 Vite+ 管理，无需单独安装。

## 开发模式

修改项目时，在根目录执行：

```sh
vp install
vpr prepare:runtime
vp dev
```

`vp dev` 启动支持热更新的开发服务。日常使用项目请执行 `vpr start`，见下方「构建与运行」。浏览器资源准备、语言服务安装与工具链检查由准备脚本统一处理。首次使用依赖时 Cargo 需要下载 crate。

项目面向本机学习。服务仅接受 localhost 和同源请求，不适合作为公共代码执行服务部署。

## 项目结构

| 目录                       | 职责                                         |
| -------------------------- | -------------------------------------------- |
| `src/docs/`                | 按章节组织的 Markdown 教材、题目、答案与解析 |
| `course/`                  | 独立的 Cargo workspace，存放课程 Rust 源码   |
| `src/components/docs/`     | 教材中的文档交互组件                         |
| `src/components/learning/` | 学习页面、练习与代码实验室组件               |
| `src/components/layout/`   | 页面布局、导航与对话框                       |
| `src/composables/`         | 导航、搜索、统计、笔记与编辑器分栏等状态逻辑 |
| `src/runtime/`             | 课程类型、解析与运行时入口                   |
| `plugins/`                 | Markdown 编译、课程目录与 Rust 源码接入      |
| `server/`                  | 本机 Cargo 执行与语言服务                    |
| `scripts/`                 | 资源准备、课程验收和启动脚本                 |

界面使用 Vue、motion-v、Tailwind CSS 和 Monaco，服务端使用 Nitro；开发工具链统一使用 Vite+。具体依赖版本见 [package.json](../package.json)。

教材按需编译加载，课程目录在构建时从同一份 Markdown 提取。Rust 源码通过虚拟模块接入网页，无需在教材中重复维护代码。编写约定见[教材编写](../src/docs/README.md)与[课程 Rust 源码](../course/README.md)。

## 验证修改

```sh
vp check
vp run typecheck
vp test
vp run verify:course
```

课程验收脚本通过 `oxnode` 执行 TypeScript，也可以按阶段运行：

| 命令                             | 检查内容                                 | 需要本机 Rust |
| -------------------------------- | ---------------------------------------- | ------------- |
| `vp run verify:course:structure` | 教材结构、字段与判题映射                 | 否            |
| `vp run verify:course:answers`   | 选择题、填空题的答案判定                 | 否            |
| `vp run verify:course:execution` | 编译运行 Rust 示例、编程题及项目参考实现 | 是            |

Rust 验收先批量编译，再默认以 2 路并发运行。需要串行时执行：

```sh
vp run verify:course -- --concurrency 1
```

准备和课程验收日志统一使用 Vite+ 的 `createLogger`，以颜色区分状态，并在完成时显示耗时。

## 构建与运行

```sh
vpr start
```

`vpr start` 会先执行构建任务，再加载生成的服务入口。构建包含类型检查，并生成 Nitro 的 `.output/`。仅构建时使用 `vpr build`；也可以直接启动已有构建：

```sh
node .output/server/index.mjs
```

纯静态托管仅具备浏览器回退能力，完整执行与语言服务需要本机服务。

## 浏览器运行资源

准备脚本生成 `public/runtime/` 等浏览器资源，大型生成资源不提交 Git。来源、固定版本与许可见[第三方说明](../THIRD_PARTY_NOTICES.md)。

浏览器 WASM 分析要求 HTTPS（localhost 除外），并需要以下响应头，开发服务已配置：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

完整模式与浏览器回退的能力差异见[学习指南](learning.md#运行模式)。
