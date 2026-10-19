export interface PromptPart {
  kind: 'text' | 'code';
  text: string;
}

export function splitPrompt(text: string): PromptPart[] {
  const result: PromptPart[] = [];
  let buffer: string[] = [];
  let kind: PromptPart['kind'] = 'text';
  let fenced = false;

  function flush() {
    const content = buffer.join('\n').trim();

    if (content) {
      result.push({ kind, text: content });
    }

    buffer = [];
  }

  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) {
      flush();
      fenced = !fenced;
      kind = fenced ? 'code' : 'text';
      continue;
    }

    const isCode =
      fenced ||
      /^\s*(?:fn\s|pub\s|let\s|use\s|impl\b|struct\s|enum\s|trait\s|mod\s|\/\/|#\[|(?:println|print|assert(?:_eq|_ne)?|vec)!|[{}]|(?:if|for|while|match)\s)/.test(
        line,
      );

    // 代码块中的缩进行继续归属代码；后续自然语言另起文本块。
    const next = isCode || (kind === 'code' && /^\s+\S/.test(line)) ? 'code' : 'text';

    if (line.trim() && next !== kind) {
      flush();
      kind = next;
    }

    buffer.push(line);
  }

  flush();
  return result;
}
