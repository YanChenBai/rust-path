import Markdown from 'unplugin-vue-markdown/vite';

import { sourceReference } from '../src/runtime/course-code';

export function courseMarkdown() {
  return Markdown({
    wrapperClasses: 'markdown-body',
    transforms: {
      before(source) {
        const imports: string[] = [];

        const body = source.replace(
          /^```rust([^\n]*)\r?\n([\s\S]*?)\r?\n```/gm,
          (fence: string, info: string, code: string) => {
            const reference = sourceReference(info);

            if (!reference) {
              return fence;
            }

            if (code.trim()) {
              throw new Error(`外部源码围栏不能重复定义代码：${reference}`);
            }

            const [mode = ''] = info.trim().split(/\s+/);

            if (mode === 'starter') {
              return '';
            }

            const variable = `courseCode${imports.length}`;
            imports.push(
              `import ${variable} from ${JSON.stringify(`virtual:course-code/${reference}`)};`,
            );
            const editorId = /\bid=([^\s]+)/.exec(info)?.[1];
            return `<MarkdownCode :code="${variable}" language="rust" mode="${mode.startsWith('source=') ? '' : mode}"${editorId ? ` editor-id="${editorId}"` : ''} />`;
          },
        );

        if (!imports.length) {
          return body;
        }

        const setup = /<script\b(?=[^>]*\bsetup\b)[^>]*>/;

        if (setup.test(body)) {
          return body.replace(setup, opening => `${opening}\n${imports.join('\n')}\n`);
        }

        return `${body}\n<script setup lang="ts">\n${imports.join('\n')}\n</script>\n`;
      },
    },
    markdownSetup(md) {
      md.renderer.rules.fence = (tokens, index) => {
        const token = tokens[index]!;
        const [language = 'rust', mode = ''] = token.info.trim().split(/\s+/);

        if (mode === 'starter') {
          return '';
        }

        const editorId = /\bid=([^\s]+)/.exec(token.info)?.[1];
        const attribute = (value: string) => md.utils.escapeHtml(JSON.stringify(value));
        return `<MarkdownCode :code="${attribute(token.content.replace(/\n$/, ''))}" language="${md.utils.escapeHtml(language)}" mode="${md.utils.escapeHtml(mode)}"${editorId ? ` editor-id="${md.utils.escapeHtml(editorId)}"` : ''} />`;
      };
    },
  });
}
