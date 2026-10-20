import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Plugin } from 'vite-plus';

export function staticNotFound(): Plugin {
  return {
    name: 'static-not-found',
    configurePreviewServer(server) {
      const output = resolve(server.config.root, server.config.build.outDir);

      const pages = new Set(
        readdirSync(output, { recursive: true, encoding: 'utf8' })
          .filter(file => file.endsWith('.html'))
          .map(file => `/${file.replaceAll('\\', '/').replace(/\.html$/, '')}`),
      );

      pages.add('/');
      const notFound = readFileSync(resolve(output, '404.html'));

      // 未知地址直接返回预渲染的 404，避免 SPA 回退先显示首页内容。
      server.middlewares.use((request, response, next) => {
        if (!request.headers.accept?.includes('text/html')) {
          next();
          return;
        }

        let path: string;

        try {
          path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
        } catch {
          next();
          return;
        }

        const page = path.replace(/\/$/, '').replace(/\.html$/, '') || '/';

        if (pages.has(page) || pages.has(`${page}/index`)) {
          next();
          return;
        }

        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(request.method === 'HEAD' ? undefined : notFound);
      });
    },
  };
}
