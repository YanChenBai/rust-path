# 开发指南

[返回项目首页](../README.md) · [学习指南](learning.md) · [教材编写](../src/docs/README.md)

## 基础依赖

前端开发需要 [Vite+](https://viteplus.dev/)，Node.js 26 与 pnpm 由 Vite+ 管理。开发本机增强服务或执行课程 Rust 验收时，还需要通过 rustup 安装 [Rust stable](https://www.rust-lang.org/tools/install)。本机语言服务还需要 `rustup component add rust-analyzer rust-src`。

## 开发模式

修改项目时，在根目录执行：

```sh
vp install
vp run prepare:browser
vp dev
```

`vp dev` 只启动前端，保留 Vue 和教材的热更新。`vp install` 的 prepare 阶段会执行浏览器资源准备；需要单独恢复资源时运行 `vp run prepare:browser`。前端不加载 Nitro 插件，也不会自动连接本机接口。

需要完整 Cargo 与语言服务时，在另一个终端执行 `vp run dev:server -- --origin http://localhost:5173`，将来源替换为前端实际地址；再在网页页头的插头设置中填写 `http://127.0.0.1:3000`。Rust 源码修改后需要重启该服务。

项目面向本机学习。增强服务只监听 `127.0.0.1`，跨域网页需通过 `--origin` 明确授权，不适合作为公共代码执行服务部署。

## 项目结构

| 目录                       | 职责                                          |
| -------------------------- | --------------------------------------------- |
| `src/docs/`                | 按章节组织的 Markdown 教材、题目、答案与解析  |
| `course/`                  | 独立的 Cargo workspace，存放课程 Rust 源码    |
| `src/components/docs/`     | 教材中的文档交互组件                          |
| `src/components/learning/` | 学习页面、练习与代码实验室组件                |
| `src/components/layout/`   | 页面布局、导航与对话框                        |
| `src/composables/`         | 导航、搜索、统计、笔记与编辑器分栏等状态逻辑  |
| `src/runtime/`             | 课程类型、解析与运行时入口                    |
| `plugins/`                 | Markdown 编译、课程目录与 Rust 源码接入       |
| `crates/server/`           | Rust 本机增强服务：Cargo 执行、LSP 会话与进度 |
| `scripts/`                 | 浏览器资源准备与课程验收脚本                  |

界面使用 Vue、motion-v、Tailwind CSS 和 Monaco；本机服务使用 Rust、Axum 和 Tokio。前端依赖见 [package.json](../package.json)，服务依赖见 [crates/server/Cargo.toml](../crates/server/Cargo.toml)。根 Cargo workspace 管理服务，`course/` 保持独立的课程 workspace。

教材按需编译加载，课程目录在构建时从同一份 Markdown 提取。Rust 源码通过虚拟模块接入网页，无需在教材中重复维护代码。编写约定见[教材编写](../src/docs/README.md)与[课程 Rust 源码](../course/README.md)。

## 验证修改

```sh
vp check
vp run typecheck
vp test
vp run verify:course
vp run check:server
vp run test:server
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
vp run build
vp preview
```

`vp run build` 先执行类型检查，再构建静态网站到 `dist/`；`vp preview` 预览已有产物。前端构建不包含本机服务，也不会清理后端产物。

纯静态托管仅具备浏览器回退能力，完整执行与语言服务需要本机服务。

部署 `dist/` 时应设置 SPA 路由回退，并为页面配置下方列出的跨源隔离响应头，以支持浏览器语义引擎。

### 独立本机服务与 Windows exe

服务源码位于 `crates/server/`，直接通过 Cargo 构建。Vite+ 任务只是命令入口，不搬运产物或额外压缩：

```sh
vp run build:server
# 等价于 cargo build --locked --release --package rust-path-server
```

Windows 产物为 `target/release/rust-path-server.exe`，Linux / macOS 为 `target/release/rust-path-server`。可将可执行文件单独复制到其他目录运行，无需 Node.js、项目源码或前端资源；用户电脑仍需安装 Rust 工具链和语言服务组件。

```powershell
rustup component add rust-analyzer rust-src
.\target\release\rust-path-server.exe --origin http://localhost:5173
```

默认监听 `http://127.0.0.1:3000`。根路径返回服务状态 JSON，`/api/capabilities` 返回工具链能力；该端口不托管课程页面。启动时检查 `rustc`、`cargo`、`rust-analyzer` 和标准库源码，失败会给出安装指引并退出，不会自动安装。使用 `--check` 可只检查工具链。

| 选项                             | 用途                         |
| -------------------------------- | ---------------------------- |
| `--port 3001` / `PORT`           | 更改监听端口，默认 3000      |
| `--origin http://localhost:5173` | 允许指定网页来源，可重复传入 |
| `ALLOWED_ORIGINS`                | 以逗号分隔的网页来源白名单   |
| `--check`                        | 检查工具链后退出             |

来源必须包含协议、主机和端口，不包含路径或末尾斜杠；`http://localhost:5173` 与 `http://127.0.0.1:5173` 不相同。浏览器可能要求授权网页访问本地网络。

网页默认使用浏览器模式，不自动探测同源 `/api`。在页头插头设置中填写服务基础地址并保存连接；选择「浏览器模式」或清空地址即可关闭连接。地址保存在当前浏览器中。具体连接与排查步骤见[学习指南](learning.md#连接本机语言服务)。

### 语言服务与启动进度

服务直接启动 rust-analyzer，通过标准输入输出交换 LSP 消息，网页经 HTTP 调用补全、悬浮说明和诊断接口。每个编辑器会话使用临时 Cargo 工程，包含当前源码与所选依赖。

LSP 握手结束后仍可能需要加载项目和建立索引。服务接收 rust-analyzer 的工作进度与后台状态通知，通过 `/api/lsp/status` 提供当前任务、真实百分比和就绪状态。网页每 250ms 查询一次启动状态，直到后台工作结束；打开会话本身不代表语言服务已经可用。

页头的 `Rust Analyzer` 指示显示当前阶段，无百分比时转圈，准备完成后淡出。关闭编辑器会停止轮询并关闭会话，切换依赖会重新建立会话并显示加载进度。启动失败或超时会显示错误，并按浏览器可用能力尝试语义回退。

### 构建缓存

- 前端 `vp run build` 使用 Vite+ 任务缓存，只恢复 `dist/`；类型检查只缓存检查结果。
- `prepare:browser` 缓存生成的 `public/runtime/` 与 `public/analyzer/`，不会安装或检查本机 Rust 工具链。
- `build:server` 关闭 Vite+ 任务缓存，直接复用 Cargo 的 `target/` 编译缓存；没有 exe 包装或 ZIP 阶段。
- 服务执行学习代码时使用临时目录下的 `rust-path-cargo-target`；课程验收另用 `node_modules/.cache/course/target`，彼此独立。

需要重新执行前端任务时使用 `vp run --no-cache build`；重新构建服务直接运行 `vp run build:server`，由 Cargo 判断需要重编译的部分。

## 浏览器运行资源

`scripts/prepare-browser.ts` 生成 `public/runtime/` 与 `public/analyzer/` 等浏览器资源，大型生成资源不提交 Git。来源、固定版本与许可见[第三方说明](../THIRD_PARTY_NOTICES.md)。

工具链使用上游 gzip 资源，由浏览器 worker 解压。未压缩的编译器和标准库超过 Cloudflare Pages 的单文件 25 MiB 限制，因此不会复制到站点；CI 会再次检查构建产物体积。

浏览器 WASM 分析要求 HTTPS（localhost 除外），并需要以下响应头，开发服务已配置：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

完整模式与浏览器回退的能力差异见[学习指南](learning.md#运行模式)。

## 版本与自动发布

前端和 server 共用根 `package.json` 的版本，初始基线为 `0.1.0`。Changesets 同时维护根更新日志和发布说明；根包保持 private，服务也不发布到 crates.io。

修改前端或服务后执行：

```sh
vp run changeset
```

选择 `rust-study`，按影响选择 patch、minor 或 major，填写本次变更说明并将生成的 `.changeset/*.md` 一起提交。只升级前端或只修改服务时也会发布同一个新版本。

发布过程如下：

1. PR 执行前端格式、类型、测试和构建检查，同时在 Windows x64、Linux x64、macOS Intel 和 Apple Silicon 上执行 Rust 格式检查、Clippy、测试、release 构建与 `--version` 检查。
2. 合并到 `master` 后，Changesets 自动维护 Release PR。版本任务同步 `package.json`、`crates/server/Cargo.toml`、`Cargo.lock` 与根 `CHANGELOG.md`，CI 拒绝前后端版本不一致的提交。
3. 合并 Release PR 后，先将该提交构建的 `dist/` 部署到 Cloudflare Pages，再创建 `v<version>` GitHub Release，上传四个平台的 server 压缩包和 `SHA256SUMS.txt`。Linux 二进制基于 Ubuntu 24.04 构建，运行环境需提供兼容的 glibc。
4. 已发布的版本会跳过重复发布。失败时可以重新运行 Release 工作流；未完成的 draft Release 会继续上传。Pages 与 GitHub Release 是两个独立服务，若后者失败，Pages 可能已经更新，此时重跑完成同版本发布。

站点的 `/version.json` 返回构建时的版本；server 的 `--version` 返回相同版本。Pages 产物保留 `_headers` 中的跨源隔离配置，并使用 Pages 默认的 SPA 回退。

### 一次性仓库配置

在 GitHub 仓库的 Settings → Secrets and variables → Actions 配置：

| 类型     | 名称                       | 内容                                   |
| -------- | -------------------------- | -------------------------------------- |
| Secret   | `CLOUDFLARE_API_TOKEN`     | 目标账户的 Cloudflare Pages Edit token |
| Secret   | `CLOUDFLARE_ACCOUNT_ID`    | Pages 项目所属账户 ID                  |
| Variable | `CLOUDFLARE_PAGES_PROJECT` | 已存在的 Pages 项目名称                |

Pages 项目使用 Direct Upload，生产分支设为 `master`；若已有 Git 集成，关闭自动构建，避免与 Actions 重复部署。无需把 Cloudflare token 放入前端环境变量。

GitHub Settings → Actions → General 需要开启 **Allow GitHub Actions to create and approve pull requests**，供 Changesets 维护 Release PR。工作流使用内置 `GITHUB_TOKEN`，无需 npm token；自动生成的 Release PR 可能不会触发新的 PR 检查，合并到 `master` 后的发布仍会先完整运行 CI。

本地可以运行 `vp run check:version` 检查一致性；`vp run version:release` 会消耗 changeset 并修改版本和日志，通常交给 Release PR 执行。自动化配置的源码验证与真实 GitHub / Cloudflare 发布是两件事，首次发布后仍需在 Actions 中确认四个平台和 Pages 部署结果。
