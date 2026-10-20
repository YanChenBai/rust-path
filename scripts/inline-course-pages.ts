import { readFile, writeFile, unlink } from 'node:fs/promises';
import { posix, resolve } from 'node:path';

interface InlinePage {
  page: string;
  route: string;
  file: string;
  imports: string[];
}

export async function inlineCoursePages(output: string, base = '/') {
  const manifestPath = resolve(output, '.course-inline-pages.json');
  const pages = JSON.parse(await readFile(manifestPath, 'utf8')) as InlinePage[];
  const pageFiles = new Set(pages.map(page => page.file));
  const pageUrls = new Set(pages.map(page => `${base}${page.file}`));

  for (const page of pages) {
    if (page.imports.some(file => pageFiles.has(file))) {
      throw new Error(`教程内联模块不能依赖另一个页面模块：${page.page}`);
    }

    let source = await readFile(resolve(output, page.file), 'utf8');

    // HTML 内联模块的相对路径基于页面 URL，需要改为构建资源的绝对路径。
    for (const dependency of page.imports) {
      const relative = posix.relative(posix.dirname(page.file), dependency);
      const specifier = relative.startsWith('.') ? relative : `./${relative}`;
      const target = JSON.stringify(`${base}${dependency}`);
      source = source
        .replaceAll(JSON.stringify(specifier), target)
        .replaceAll(`'${specifier}'`, target);
    }

    const path = resolve(output, `${page.route.slice(1)}.html`);
    let html = await readFile(path, 'utf8');
    html = html.replace(/<link\b[^>]*>/gi, tag => {
      const href = /\bhref=["']([^"']+)["']/.exec(tag)?.[1];
      return tag.includes('modulepreload') && href && pageUrls.has(href) ? '' : tag;
    });
    const script = `<script type="module" data-course-page="${page.page}">${source.replace(/<\/script/gi, '<\\/script')}</script>`;

    if (!html.includes('</body>')) {
      throw new Error(`教程 HTML 缺少 body：${page.route}`);
    }

    await writeFile(path, html.replace('</body>', `${script}</body>`));
  }

  const ssrManifestPath = resolve(output, '.vite/ssr-manifest.json');

  const ssrManifest = JSON.parse(await readFile(ssrManifestPath, 'utf8')) as Record<
    string,
    string[]
  >;

  for (const files of Object.values(ssrManifest)) {
    for (let index = files.length - 1; index >= 0; index--) {
      if (pageUrls.has(files[index]!)) {
        files.splice(index, 1);
      }
    }
  }

  await writeFile(ssrManifestPath, JSON.stringify(ssrManifest, null, 2));
  await Promise.all(pages.map(page => unlink(resolve(output, page.file))));
  await unlink(manifestPath);
}
