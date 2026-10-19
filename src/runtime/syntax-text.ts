import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: false });

export function syntaxSegments(text: string, code = false): { text: string; code: boolean }[] {
  if (code) {
    return [{ text, code: true }];
  }

  // 显式行内代码优先，不能因自然语言里的分号、花括号把整句当作 Rust。
  if (text.includes('`')) {
    const tokens = markdown.parseInline(text, {})[0]?.children ?? [];
    return tokens
      .filter(token => ['text', 'code_inline', 'softbreak'].includes(token.type))
      .map(token => ({
        text: token.type === 'softbreak' ? '\n' : token.content,
        code: token.type === 'code_inline',
      }));
  }

  const isCode =
    /^(?:fn |let |use |impl |pub |&|Box<|Rc<|Arc<)|^\w+(?:::\w+)*!?\([\s\S]*\);?$/.test(text);

  return [{ text, code: isCode }];
}
