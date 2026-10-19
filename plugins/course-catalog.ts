import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

import type { Plugin } from 'vite-plus';

import { buildDocuments } from '../src/runtime/course-documents';

export function courseCatalog(): Plugin {
  const id = '\0virtual:course-catalog';
  const root = resolve('src/docs');

  return {
    name: 'course-catalog',
    resolveId(source) {
      if (source === 'virtual:course-catalog') {
        return id;
      }
    },
    async load(source) {
      if (source !== id) {
        return;
      }

      const files: Record<string, string> = {};
      const entries = await readdir(root, { recursive: true, withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.md') || entry.parentPath === root) {
          continue;
        }

        const path = resolve(entry.parentPath, entry.name);
        this.addWatchFile(path);
        files[relative(root, path).replaceAll('\\', '/')] = await readFile(path, 'utf8');
      }

      return `export default ${JSON.stringify(buildDocuments(files))};`;
    },
    handleHotUpdate(context) {
      if (!context.file.replaceAll('\\', '/').includes('/src/docs/')) {
        return;
      }

      const module = context.server.moduleGraph.getModuleById(id);

      if (module) {
        context.server.moduleGraph.invalidateModule(module);
      }

      context.server.ws.send({ type: 'full-reload' });
    },
  };
}
