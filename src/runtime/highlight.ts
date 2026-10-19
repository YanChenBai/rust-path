import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
let highlighter: ReturnType<typeof createHighlighterCore> | undefined;

export async function highlightCode(code: string, lang = 'rust') {
  highlighter ??= createHighlighterCore({
    themes: [import('shiki/themes/github-dark-default.mjs')],
    langs: [
      import('shiki/langs/rust.mjs'),
      import('shiki/langs/toml.mjs'),
      import('shiki/langs/bash.mjs'),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return (await highlighter).codeToHtml(code, { lang, theme: 'github-dark-default' });
}
