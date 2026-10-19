import { describe, expect, it } from 'vite-plus/test';

import { splitPrompt } from './question-prompt';
import { syntaxSegments } from './syntax-text';

describe('行内代码显示', () => {
  it('非围栏示例清理行内标记，围栏源码保留字面量反引号', () => {
    expect(splitPrompt('观察输出：\n`let value: Vec<String> = vec![];`\n结果是什么？')).toEqual([
      { kind: 'text', text: '观察输出：' },
      { kind: 'code', text: 'let value: Vec<String> = vec![];' },
      { kind: 'text', text: '结果是什么？' },
    ]);
    expect(splitPrompt('```rust\nlet value = "`text`";\n```')).toEqual([
      { kind: 'code', text: 'let value = "`text`";' },
    ]);
  });
  it('自然语言中的格式占位符和分号不应使整句变成代码', () => {
    expect(syntaxSegments('执行 `println!("{value}");` 后输出什么？')).toEqual([
      { text: '执行 ', code: false },
      { text: 'println!("{value}");', code: true },
      { text: ' 后输出什么？', code: false },
    ]);
    expect(syntaxSegments('占位符 {}；路径 std::fmt 保持原样。')).toEqual([
      { text: '占位符 {}；路径 std::fmt 保持原样。', code: false },
    ]);
  });

  it('支持多反引号、HTML 实体和显式代码答案', () => {
    expect(syntaxSegments('使用 ``a`b`` 和 `Vec<String>`，值 &gt; 0。')).toEqual([
      { text: '使用 ', code: false },
      { text: 'a`b', code: true },
      { text: ' 和 ', code: false },
      { text: 'Vec<String>', code: true },
      { text: '，值 > 0。', code: false },
    ]);
    expect(syntaxSegments('println!("你好");')).toEqual([
      { text: 'println!("你好");', code: true },
    ]);
    expect(syntaxSegments('`literal`', true)).toEqual([{ text: '`literal`', code: true }]);
  });
});
