# 教材编写

[返回项目首页](../../README.md) · [开发指南](../../docs/development.md) · [课程 Rust 源码](../../course/README.md)

## 添加内容的步骤

### 补充已有章节

| 想添加的内容 | 文件位置                       | 需要注意                                                                   |
| ------------ | ------------------------------ | -------------------------------------------------------------------------- |
| 知识点       | `lessons/<id>.md`              | 使用唯一 `id`，设置所属 `chapterId` 与 `order`，提供 playground 示例       |
| 深入讲解     | `guides/<lessonId>-<index>.md` | 通过 `lessonId` 关联知识点，`index` 决定顺序                               |
| 章节题       | `questions/<id>.md`            | 设置题型、顺序与 `assessment`；当前每章固定 8 题，新增题目时需调整原有题目 |
| 专项项目     | `project.md`                   | 每章一个，提供需求、验收要求、初始代码与判题断言                           |

这些路径均相对于对应的 `src/docs/NN-name/`。可以参考现有的 [hello 知识点](01-start/lessons/hello.md)和[深入讲解](01-start/guides/hello-0.md)。字段与源码引用方式见下文。

### 添加完整章节

1. 创建 `src/docs/NN-name/`，参考 [01-start](01-start/chapter.md) 编写 `chapter.md`。目录中 `name` 必须与章节 `id` 一致，`icon` 用于章节排序，`stage` 指定学习阶段。
2. 添加 `lessons/` 下的知识点、`questions/` 下的 8 道题，以及 `project.md`。课时和题目的 `chapterId` 与章节 `id` 一致；知识点至少一个，深入讲解按需添加。
3. 创建对应的 `course/NN-name/Cargo.toml`，参考[现有章节配置](../../course/01-start/Cargo.toml)设置唯一包名、Edition 2024 与所需依赖。根 Cargo workspace 自动发现章节包，无需手动注册。
4. 将可运行示例、参考实现放入 `src/bin/`，练习骨架放入 `starters/`，题干片段放入 `snippets/`；在 Markdown 中通过 `source=` 引用。所有路径相对于根目录 `course/`。
5. 为课时、题目和代码示例使用唯一 ID，补齐答案、解析与断言。修改现有内容时保持已有 ID，避免丢失学习记录关联。

### 预览与验收

在仓库根目录运行 `vp dev`，检查新增内容的导航、排版、代码编辑和答题反馈。目录与页面会随教材修改更新，无需修改集中课程表。

```sh
vpr verify:course:structure
vpr verify:course:answers
vpr verify:course:execution
```

三个阶段分别检查结构、文本答案与 Rust 执行结果，也可以使用 `vpr verify:course` 一次完成。Rust 执行阶段需要本机工具链；缓存和强制重新验收方式见下文「验证」。新增章节后也应同步更新首页的课程数量和学习路线。

## 目录约定

每章一个目录，例如 `01-start/`。`chapter.md` 定义章节元信息，`lessons/` 存知识点，`guides/` 存深入讲解，`questions/` 存逐题挑战，`project.md` 存专项实操。

固定结构如下；新增题目、课时或章节由目录自动发现，不再维护 `src/data` 中的集中内容表：

```text
src/docs/01-start/
├─ chapter.md
├─ lessons/hello.md
├─ guides/hello-0.md
├─ questions/start-choice.md
└─ project.md

course/                         # 仓库根目录的独立 Cargo workspace
├─ Cargo.toml
├─ Cargo.lock
└─ 01-start/
   ├─ Cargo.toml
   ├─ src/bin/hello.rs           # 完整示例、指南及编程参考实现
   ├─ starters/start-code-starter.rs
   └─ snippets/start-choice-snippet-1.rs
```

`src/runtime` 只保留类型、解析器、运行时入口和学习记录迁移所需的历史快照。当前章节顺序由 `chapter.md` 的 `icon` 决定；深入课时通过 `advanced: true` 标记。新增章节时在 `course/NN-name/Cargo.toml` 声明本章依赖；根 workspace 自动发现章节包，Cargo 自动发现 `src/bin/*.rs`。

正文通过 `unplugin-vue-markdown` 编译成 Vue 组件，按需加载。可以直接使用 Markdown 标题、段落、行内代码、列表、表格、链接和代码围栏。修改教材会更新目录与页面。

## 知识点

frontmatter 使用 `type: lesson`、稳定的 `id`、`chapterId`、`order`、`title`、`subtitle`、`minutes`。依赖通过 `dependencies` 数组声明；需要本机能力时设置 `nativeRequired: true`。保持已有 ID 可以保留浏览器里的进度、笔记与草稿。

第一个二级标题是核心概念，其后段落是知识点简介。提示和小挑战可用组件包裹：

```vue
<CourseCallout title="注意边界">

这里写 Markdown，可以使用 `String` 等行内代码。

</CourseCallout>
```

## 代码围栏

- `rust`、`toml`、`bash`：有复制按钮的静态高亮代码。
- `rust runnable id=hello-guide-1`：先阅读，点击编辑运行，允许返回阅读；ID 必须唯一。
- `rust playground id=hello`：直接展示可编辑示例，按实际代码高度展开。
- `rust starter`：题目或项目的初始代码，由题目编辑器使用，不会在题面中重复显示。

Rust 正文、骨架和参考答案只在根目录 `course/` 的 `.rs` 中维护。Markdown 用空围栏引用源码，例如：

````md
```rust playground id=hello source=01-start/src/bin/hello.rs

```
````

插件将此引用转换为 `virtual:course-code/01-start/src/bin/hello.rs` 的导入，再传给 `MarkdownCode`。也可以在 `<script setup>` 中手动导入该虚拟模块。课程目录与验收脚本通过同一读取器加载 `.rs`；修改源码会刷新目录和网页。引用围栏不能再填写一份代码，缺少文件时会明确报错。

`<LessonGuides lesson-id="hello" />` 可嵌入这个知识点的深入讲解。源码中的注释和分段会保留。普通文字中的泛型、函数签名等应整体包在反引号内，例如 `Option<String>`、`fn length(text: &str) -> usize`。

## 题目与项目

题目的 frontmatter 使用 `type: question`、`id`、`chapterId`、`order`、`kind` 和 `title`；选择题的 `options` 数组保存选项原文。正文写题干，题干代码使用普通 Rust 围栏，编程骨架使用 starter 围栏。

项目使用 `type: project` 和 `chapterId`。正文先写需求背景，然后用 `## 验收要求` 和列表描述验收条件，最后提供 starter 围栏。每道题和项目在自己的 frontmatter 中声明 `assessment`，不再使用集中答案文件；它只参与判题数据构建，不作为题面正文展示，查看答案仍遵守失败三次后主动查看的规则。

文本题示例：

```yaml
assessment:
  answer: main()
  mode: call
  explanation: Rust 二进制程序从 main 函数开始执行。
```

`mode` 为 `exact` 时区分大小写；`call` 忽略大小写及末尾 `()`；其他模式忽略大小写。所有模式都会去除首尾空白。

编程题和项目引用同一个可运行 `.rs` 中的源码区段：

```yaml
assessment:
  answerSource: 01-start/src/bin/start-code.rs?region=answer
  testsSource: 01-start/src/bin/start-code.rs?region=tests
  explanation: 返回题目要求的问候语。
```

`.rs` 使用 `// region:answer` 与 `// endregion:answer` 包裹参考实现，使用 `// region:tests` 与 `// endregion:tests` 包裹 `main` 中的断言；断言之后保留 `println!("__PASS__");`。这些标记让网页取出答案与断言，而 Cargo 直接编译完整文件。练习骨架与故意报错的片段放在 `starters/`、`snippets/`，不纳入可执行目标。

## 使用其他 Vue 组件

Markdown 支持 `<script setup>`，可以导入自定义 Vue 组件后直接在正文使用。也可以在 Vue 文件中 `import Lesson from './lesson.md'`，把整个 Markdown 当作组件使用。

## 验证

运行 `vp check`、`vp test`、`vp run build`。课程验收由 TypeScript 脚本通过 `oxnode` 执行：

- `vp run verify:course:structure`：检查教材结构、字段及判题映射，不执行判题函数或 Rust。
- `vp run verify:course:answers`：执行选择题、填空题的答案判定检查，不运行 Rust。
- `vp run verify:course:execution`：实际编译并运行 Rust 示例、编程题及项目参考实现，需要本机 Rust 工具链。
- `vp run verify:course`：依次运行以上三个能力。

脚本支持 `--only structure|answers|execution`；`--structure-only` 保留为仅检查结构的快捷参数。验收先通过一次 Cargo 调用批量构建选中的 bin，再默认以 2 路并发运行各个程序；可通过 `vp run verify:course -- --concurrency 1` 切回串行。编译缓存保存在 `node_modules/.cache/course/target`，实际执行时复用 Cargo 增量编译，并重新运行所有选中程序；报告记录新编译与缓存复用数量。单个示例编译失败时继续收集其他产物，只运行本次构建实际返回的可执行文件。报告按任务完成顺序记录，写入串行排队；日志显示带颜色的通过、失败和重试结果，以及进度与耗时。

`--skip-advanced-lessons` 仅跳过深入课程的课时示例，`--previous-report PATH` 将历史执行统计附在报告中，不计作本次执行。JSON 报告保存在仓库根目录 `.rust-path/reports/<验收范围>-<运行编号>/report.json`，该目录不提交 Git。

验收默认只打印每项的完成结果，失败和重试仍有诊断；单独执行一个能力时省去阶段的 RUN/PASS，只保留汇总和完成摘要。`prepare:browser` 与四个 `verify:course` 任务均启用 Vite+ 缓存，记录脚本、教材、Rust 源码、锁文件及相关配置输入。命中缓存时恢复生成资源或报告，并回放上次日志，不会重新生成浏览器资源或运行 Rust。浏览器资源准备不安装或检查本机工具链。需要重新准备资源或重新执行断言时，使用 `vp run --no-cache prepare:browser`、`vp run --no-cache verify:course`。
