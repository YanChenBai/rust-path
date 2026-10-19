import Markdown from 'unplugin-vue-markdown/vite';

export function courseMarkdown() {
  return Markdown({
    wrapperClasses: 'markdown-body',
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
