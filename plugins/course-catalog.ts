import { resolve } from 'node:path';

import type { Plugin } from 'vite-plus';

import { courseSource } from '../src/runtime/course-code';
import { buildDocuments } from '../src/runtime/course-documents';
import { loadCourseDocuments, loadCourseSources } from './course-sources';

export function courseCatalog(): Plugin {
  const catalogId = 'virtual:course-catalog';
  const assessmentId = 'virtual:course-assessments';
  const codePrefix = 'virtual:course-code/';
  const root = resolve('.');
  let sources: ReturnType<typeof loadCourseSources> | undefined;

  return {
    name: 'course-catalog',
    resolveId(source) {
      if (source === catalogId || source === assessmentId || source.startsWith(codePrefix)) {
        return `\0${source}`;
      }
    },
    async load(source) {
      if (!source.startsWith('\0virtual:course-')) {
        return;
      }

      sources ??= loadCourseSources(root, path => this.addWatchFile(path));
      const codes = await sources;
      const id = source.slice(1);

      if (id.startsWith(codePrefix)) {
        return `export default ${JSON.stringify(courseSource(codes, id.slice(codePrefix.length)))};`;
      }

      const files = await loadCourseDocuments(root, path => this.addWatchFile(path));
      const { assessmentDefinitions, ...documents } = buildDocuments(files, codes);
      return `export default ${JSON.stringify(id === assessmentId ? assessmentDefinitions : documents)};`;
    },
    handleHotUpdate(context) {
      const file = context.file.replaceAll('\\', '/');

      if (!file.includes('/src/docs/') && !file.includes('/course/')) {
        return;
      }

      sources = undefined;

      for (const module of context.server.moduleGraph.idToModuleMap.values()) {
        if (module.id?.startsWith('\0virtual:course-')) {
          context.server.moduleGraph.invalidateModule(module);
        }
      }

      context.server.ws.send({ type: 'full-reload' });
    },
  };
}
