import { describe, expect, it } from 'vite-plus/test';

import { chapters } from '../runtime/course';
import { buildDocuments, parseDocument } from './course-documents';

describe('Markdown 教材', () => {
  it('正文和验收读取同一份外部 Rust 源码，缺失引用会报错', () => {
    const source = '01-demo/src/bin/demo.rs';
    const code = 'fn main() { println!("demo"); }';
    const markdown = `---\ntype: lesson\n---\n\`\`\`rust playground id=demo source=${source}\n\n\`\`\``;
    expect(parseDocument(markdown, { [source]: code }).blocks).toEqual([
      { info: 'rust playground id=demo', code, source },
    ]);
    expect(() => parseDocument(markdown)).toThrow('源码不存在');
    expect(() =>
      parseDocument(markdown.replace('\n\n```', '\nfn main() {}\n```'), { [source]: code }),
    ).toThrow('重复定义');
  });
  it('Windows 换行不会进入围栏语言标识或初始代码', () => {
    const document = parseDocument(
      '---\r\ntype: question\r\n---\r\n```rust starter\r\nfn main() {}\r\n```\r\n',
    );

    expect(document.blocks).toEqual([{ info: 'rust starter', code: 'fn main() {}' }]);
  });
  it('拒绝缺少或无效的教材元信息', () => {
    expect(() => parseDocument('# 普通文档')).toThrow('frontmatter');
    expect(() => parseDocument('---\nnull\n---\n正文')).toThrow('type');
    expect(() => parseDocument('---\n- lesson\n---\n正文')).toThrow('type');
  });

  it('完整保留 Rust 注释、泛型、格式占位符和空行', () => {
    const code =
      'fn main() {\n    // 保留注释与段落\n    let items: Vec<String> = vec![];\n\n    println!("{{items}} {:?}", items);\n}';

    const document = parseDocument(
      [
        '---',
        'type: lesson',
        'id: demo',
        '---',
        '',
        '```rust playground id=demo',
        code,
        '```',
      ].join('\n'),
    );

    expect(document.blocks).toEqual([{ info: 'rust playground id=demo', code }]);
  });

  it('缺少可运行知识点时明确报错，不静默生成残缺课程', () => {
    expect(() =>
      buildDocuments({
        '01-demo/lessons/demo.md': '---\ntype: lesson\nid: demo\n---\n## 测试\n正文',
      }),
    ).toThrow('缺少 playground');
  });

  it('全部课时、题目和项目都指向章节目录中的 Markdown', () => {
    for (const chapter of chapters) {
      const folder = `${chapter.icon}-${chapter.id}/`;
      expect(chapter.document).toBe(`${folder}chapter.md`);
      expect(chapter.project.document).toBe(`${folder}project.md`);

      for (const lesson of chapter.lessons) {
        expect(lesson.document).toBe(`${folder}lessons/${lesson.id}.md`);
      }

      for (const question of chapter.questions) {
        expect(question.document).toBe(`${folder}questions/${question.id}.md`);
        expect(question.prompt).not.toContain('rust starter');
      }
    }
  });
});
