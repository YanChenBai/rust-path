import { resolve } from 'node:path';

import type { Plugin } from 'vite-plus';

import { courseSource } from '../src/runtime/course-code';
import { buildDocuments } from '../src/runtime/course-documents';
import { coursePages, coursePageRoute } from './course-pages';
import { loadCourseDocuments, loadCourseSources } from './course-sources';

export function courseCatalog(): Plugin {
  const catalogId = 'virtual:course-catalog';
  const assessmentId = 'virtual:course-assessments';
  const pagesId = 'virtual:course-pages';
  const pagePrefix = 'virtual:course-page/';
  const codePrefix = 'virtual:course-code/';
  const root = resolve('.');
  let sources: ReturnType<typeof loadCourseSources> | undefined;
  let documents: Promise<ReturnType<typeof buildDocuments>> | undefined;
  let isClientBuild = false;
  const pageReferences = new Map<string, string>();
  const loaderPath = resolve(root, 'src/runtime/course-page-loader.ts').replaceAll('\\', '/');

  function loadDocuments(onRead: (path: string) => void) {
    sources ??= loadCourseSources(root, onRead);
    documents ??= Promise.all([loadCourseDocuments(root, onRead), sources]).then(([files, codes]) =>
      buildDocuments(files, codes),
    );

    return documents;
  }

  return {
    name: 'course-catalog',
    configResolved(config) {
      isClientBuild = config.command === 'build' && !config.build.ssr;
    },
    async buildStart() {
      pageReferences.clear();

      if (!isClientBuild) {
        return;
      }

      const pages = coursePages(await loadDocuments(path => this.addWatchFile(path)));

      for (const page of Object.keys(pages)) {
        pageReferences.set(
          page,
          this.emitFile({
            type: 'chunk',
            id: pagePrefix + page,
            name: page,
            preserveSignature: 'strict',
          }),
        );
      }
    },
    generateBundle(_options, bundle) {
      if (!isClientBuild) {
        return;
      }

      const entries = [...pageReferences].map(([page, reference]) => {
        const file = this.getFileName(reference);
        const chunk = bundle[file];

        if (!chunk || chunk.type !== 'chunk') {
          throw new Error(`教程页面未生成：${page}`);
        }

        return { page, route: coursePageRoute(page), file, imports: chunk.imports };
      });

      this.emitFile({
        type: 'asset',
        fileName: '.course-inline-pages.json',
        source: JSON.stringify(entries),
      });
    },
    resolveId(source) {
      if (
        source === catalogId ||
        source === assessmentId ||
        source === pagesId ||
        source.startsWith(codePrefix) ||
        source.startsWith(pagePrefix)
      ) {
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

      const { assessmentDefinitions, ...catalog } = await loadDocuments(path =>
        this.addWatchFile(path),
      );

      if (id === pagesId || id.startsWith(pagePrefix)) {
        const pages = coursePages({ ...catalog, assessmentDefinitions });

        if (id === pagesId) {
          const entries = Object.entries(pages).flatMap(([page, paths]) =>
            paths.map(
              path =>
                `${JSON.stringify(path)}: () => (import.meta.env.SSR || import.meta.env.DEV
                  ? import(${JSON.stringify(pagePrefix + page)}).then(module => module.default)
                  : loadCoursePage(${JSON.stringify(page)}, ${JSON.stringify(coursePageRoute(page))})
                ).then(documents => documents[${JSON.stringify(path)}])`,
            ),
          );

          return `import { loadCoursePage } from ${JSON.stringify(loaderPath)};\nexport default {${entries.join(',')}};`;
        }

        const paths = pages[id.slice(pagePrefix.length)];

        if (!paths) {
          throw new Error(`教程页面不存在：${id}`);
        }

        const imports = paths.map(
          (path, index) =>
            `import document${index} from ${JSON.stringify(resolve(root, 'src/docs', path).replaceAll('\\', '/'))};`,
        );

        const entries = paths.map((path, index) => `${JSON.stringify(path)}: document${index}`);

        return `import { registerCoursePage } from ${JSON.stringify(loaderPath)};\n${imports.join('\n')}\nconst documents = {${entries.join(',')}};\nregisterCoursePage(${JSON.stringify(id.slice(pagePrefix.length))}, documents);\nexport default documents;`;
      }

      return `export default ${JSON.stringify(id === assessmentId ? assessmentDefinitions : catalog)};`;
    },
    handleHotUpdate(context) {
      const file = context.file.replaceAll('\\', '/');

      if (!file.includes('/src/docs/') && !file.includes('/course/')) {
        return;
      }

      sources = undefined;
      documents = undefined;

      for (const module of context.server.moduleGraph.idToModuleMap.values()) {
        if (module.id?.startsWith('\0virtual:course-')) {
          context.server.moduleGraph.invalidateModule(module);
        }
      }

      context.server.ws.send({ type: 'full-reload' });
    },
  };
}
