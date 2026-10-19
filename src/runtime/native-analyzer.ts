import type * as Monaco from 'monaco-editor/editor/editor.api.js';

import { nativeRequest } from './native';
interface Position {
  line: number;
  character: number;
}
interface Range {
  start: Position;
  end: Position;
}
interface Documentation {
  value: string;
  kind?: string;
}
interface Completion {
  label: string;
  kind?: number;
  detail?: string;
  documentation?: string | Documentation;
  insertText?: string;
  insertTextFormat?: number;
  filterText?: string;
  sortText?: string;
  textEdit?: { range?: Range; replace?: Range; newText: string };
}
interface Diagnostic {
  message: string;
  severity?: number;
  range: Range;
  source?: string;
  code?: string | number;
}

const range = (value: Range): Monaco.IRange => ({
  startLineNumber: value.start.line + 1,
  startColumn: value.start.character + 1,
  endLineNumber: value.end.line + 1,
  endColumn: value.end.character + 1,
});

function markerSeverity(severity?: number): Monaco.MarkerSeverity {
  const severities: Record<number, Monaco.MarkerSeverity> = { 1: 8, 2: 4, 3: 2 };
  return severities[severity ?? 4] ?? 1;
}

function documentation(
  value?: string | Documentation,
): string | Monaco.IMarkdownString | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (value?.value) {
    return { value: value.value };
  }

  return undefined;
}

function completionRange(item: Completion, line: number, column: number): Monaco.IRange {
  const editRange = item.textEdit?.range ?? item.textEdit?.replace;

  if (editRange) {
    return range(editRange);
  }

  return { startLineNumber: line, endLineNumber: line, startColumn: column, endColumn: column };
}

function completionItem(
  item: Completion,
  line: number,
  column: number,
): Monaco.languages.CompletionItem {
  return {
    label: item.label,
    kind: Math.max(0, (item.kind ?? 1) - 1),
    detail: item.detail,
    documentation: documentation(item.documentation),
    insertText: item.textEdit?.newText ?? item.insertText ?? item.label,
    insertTextRules: item.insertTextFormat === 2 ? 4 : 0,
    filterText: item.filterText,
    sortText: item.sortText,
    range: completionRange(item, line, column),
  };
}

function closeSession(id: string) {
  return nativeRequest('lsp/close', { id }).catch(() => {
    // 断连时由服务端会话过期清理回收资源。
  });
}

export class NativeAnalyzer {
  id = '';
  version = 1;
  private generation = 0;

  async open(code: string, dependencies: string[]) {
    const generation = ++this.generation;
    const result = await nativeRequest<{ id: string }>('lsp/open', { code, dependencies });

    if (generation !== this.generation) {
      await closeSession(result.id);
      return;
    }

    const previous = this.id;
    this.id = result.id;
    this.version = 1;

    if (previous) {
      await closeSession(previous);
    }
  }

  async update(code: string) {
    await nativeRequest('lsp/change', { id: this.id, code });
    this.version++;
    return { diagnostics: [] };
  }

  async diagnostics() {
    const data = await nativeRequest<{ diagnostics: Diagnostic[] }>('lsp/diagnostics', {
      id: this.id,
    });

    return data.diagnostics.map(d => ({
      ...range(d.range),
      message: d.message,
      severity: markerSeverity(d.severity),
      source: d.source,
      code: d.code === undefined ? undefined : String(d.code),
    }));
  }

  async completions(line: number, column: number): Promise<Monaco.languages.CompletionItem[]> {
    const data = await nativeRequest<{ result: Completion[] | { items: Completion[] } | null }>(
      'lsp/completion',
      { id: this.id, position: { line: line - 1, character: column - 1 } },
    );

    const items = Array.isArray(data.result) ? data.result : (data.result?.items ?? []);
    return items.map(item => completionItem(item, line, column));
  }

  async hover(line: number, column: number): Promise<Monaco.languages.Hover | null> {
    const data = await nativeRequest<{
      result: {
        contents: string | Documentation | Array<string | Documentation>;
        range?: Range;
      } | null;
    }>('lsp/hover', { id: this.id, position: { line: line - 1, character: column - 1 } });

    if (!data.result) {
      return null;
    }

    const values = Array.isArray(data.result.contents)
      ? data.result.contents
      : [data.result.contents];

    return {
      contents: values.map(value => ({ value: typeof value === 'string' ? value : value.value })),
      range: data.result.range ? range(data.result.range) : undefined,
    };
  }

  close() {
    this.generation++;
    const id = this.id;
    this.id = '';

    if (id) {
      void closeSession(id);
    }
  }
}
