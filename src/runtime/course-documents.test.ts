import { describe, expect, it } from 'vite-plus/test';

import { chapters } from '../data/course';
import { buildDocuments, parseDocument } from './course-documents';

describe('Markdown 教材', () => {
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
      buildDocuments({ 'demo.md': '---\ntype: lesson\nid: demo\n---\n## 测试\n正文' }),
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
