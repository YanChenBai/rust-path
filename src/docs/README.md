# 教材编写

每章一个目录，例如 `01-start/`。`chapter.md` 定义章节元信息，`lessons/` 存知识点，`guides/` 存深入讲解，`questions/` 存逐题挑战，`project.md` 存专项实操。

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

`<LessonGuides lesson-id="hello" />` 可嵌入这个知识点的深入讲解。围栏内的 Rust 原样用于编辑和编译，保持必要的注释和分段。普通文字中的泛型、函数签名等应整体包在反引号内，例如 `Option<String>`、`fn length(text: &str) -> usize`。

## 题目与项目

题目的 frontmatter 使用 `type: question`、`id`、`chapterId`、`order`、`kind` 和 `title`；选择题的 `options` 数组保存选项原文。正文写题干，题干代码使用普通 Rust 围栏，编程骨架使用 starter 围栏。

项目使用 `type: project` 和 `chapterId`。正文先写需求背景，然后用 `## 验收要求` 和列表描述验收条件，最后提供 starter 围栏。答案与实际 Rust 测试在 `src/data/assessment-content.json`，不会写在题面 Markdown 中；展示仍遵守失败三次后主动查看的规则。

## 使用其他 Vue 组件

Markdown 支持 `<script setup>`，可以导入自定义 Vue 组件后直接在正文使用。也可以在 Vue 文件中 `import Lesson from './lesson.md'`，把整个 Markdown 当作组件使用。

## 验证

运行 `vp check`、`vp test`、`vp run build`。`vp run verify:course -- --structure-only` 检查教材及判题映射，`vp run verify:course` 实际编译并运行所有 Rust 示例和参考实现。
