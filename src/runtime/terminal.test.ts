import { describe, expect, it } from 'vite-plus/test';

import { terminalHtml } from './terminal';

describe('终端诊断渲染', () => {
  it('无 ANSI 的警告和编译错误也标记严重程度，并保留换行', () => {
    const html = terminalHtml(
      'warning: unused\nerror[E0308]: mismatched types\n  note: expected u32',
    );

    expect(html).toContain('color:#e3b341">warning:</span> unused\n');
    expect(html).toContain('color:#ff7b72">error[E0308]:</span> mismatched types\n');
    expect(html).toContain('  <span style="color:#79c0ff">note:</span> expected u32');
  });

  it('保留 ANSI 颜色，并转义输出中的 HTML', () => {
    const html = terminalHtml('\u001b[31merror:\u001b[0m <img src=x onerror=alert(1)>');

    expect(html).toContain('<span style="color:');
    expect(html).toContain('&lt;img');
    expect(html).not.toContain('<img');
    expect(terminalHtml('warning: <script>alert(1)</script>')).not.toContain('<script>');
  });
});
