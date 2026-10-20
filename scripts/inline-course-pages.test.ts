import { mkdtemp, mkdir, readFile, writeFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect, test } from 'vite-plus/test';

import { inlineCoursePages } from './inline-course-pages';

test('页面模块写入所属 HTML，改写公共依赖并移除独立文件和预加载引用', async () => {
  const output = await mkdtemp(join(tmpdir(), 'rust-study-inline-'));

  try {
    await Promise.all([
      mkdir(join(output, 'assets')),
      mkdir(join(output, 'learn')),
      mkdir(join(output, '.vite')),
    ]);
    await Promise.all([
      writeFile(
        join(output, '.course-inline-pages.json'),
        JSON.stringify([
          {
            page: 'lesson-hello',
            route: '/learn/hello',
            file: 'assets/lesson-hello.js',
            imports: ['assets/shared.js'],
          },
        ]),
      ),
      writeFile(
        join(output, 'assets/lesson-hello.js'),
        'import { register } from "./shared.js"; register("</script>");',
      ),
      writeFile(join(output, 'assets/shared.js'), 'export function register() {}'),
      writeFile(
        join(output, 'learn/hello.html'),
        '<html><head><link rel="modulepreload" href="/assets/lesson-hello.js"><link rel="modulepreload" href="/assets/shared.js"></head><body><p>正文</p></body></html>',
      ),
      writeFile(
        join(output, '.vite/ssr-manifest.json'),
        JSON.stringify({ 'hello.md': ['/assets/lesson-hello.js', '/assets/shared.js'] }),
      ),
    ]);
    await inlineCoursePages(output);
    const html = await readFile(join(output, 'learn/hello.html'), 'utf8');

    expect(html).toContain('<p>正文</p>');
    expect(html).toContain('data-course-page="lesson-hello"');
    expect(html).toContain('from "/assets/shared.js"');
    expect(html).toContain('register("<\\/script>")');
    expect(html).not.toContain('/assets/lesson-hello.js');
    expect(html).toContain('<link rel="modulepreload" href="/assets/shared.js">');
    await expect(access(join(output, 'assets/lesson-hello.js'))).rejects.toThrow();
    await expect(access(join(output, '.course-inline-pages.json'))).rejects.toThrow();
    const manifest = await readFile(join(output, '.vite/ssr-manifest.json'), 'utf8');

    expect(JSON.parse(manifest)).toEqual({
      'hello.md': ['/assets/shared.js'],
    });
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
