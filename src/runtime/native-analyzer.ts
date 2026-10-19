import type * as Monaco from 'monaco-editor/editor/editor.api.js';

import { nativeRequest, nativeServiceUrl } from './native';
import { beginResourceLoading } from './resource-loading';

interface AnalyzerStatus {
  ready: boolean;
  health: 'ok' | 'warning' | 'error';
  message?: string;
  tasks: { title?: string; message?: string; percentage?: number }[];
}
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

function closeSession(id: string, endpoint: string) {
  return nativeRequest('lsp/close', { id }, endpoint).catch(() => {
    // 断连时由服务端会话过期清理回收资源。
  });
}

export class NativeAnalyzer {
  id = '';
  version = 1;
  private generation = 0;
  private loading?: ReturnType<typeof beginResourceLoading>;
  private readonly endpoint = nativeServiceUrl.value;

  private request<T>(path: string, body: unknown) {
    return nativeRequest<T>(path, body, this.endpoint);
  }

  async open(code: string, dependencies: string[]) {
    const generation = ++this.generation;
    this.loading?.dispose();
    const loading = beginResourceLoading('language', 'Starting language server');
    this.loading = loading;

    try {
      const result = await this.request<{ id: string }>('lsp/open', { code, dependencies });

      if (generation !== this.generation) {
        await closeSession(result.id, this.endpoint);
        return;
      }

      const previous = this.id;
      this.id = result.id;
      this.version = 1;

      if (previous) {
        await closeSession(previous, this.endpoint);
      }

      await this.waitUntilReady(result.id, generation, loading);
    } catch (error) {
      if (generation === this.generation) {
        loading.fail(error instanceof Error ? error.message : 'Language server failed to start');
        const id = this.id;
        this.id = '';

        if (id) {
          await closeSession(id, this.endpoint);
        }
      }

      throw error;
    }
  }

  private async waitUntilReady(
    id: string,
    generation: number,
    loading: ReturnType<typeof beginResourceLoading>,
  ) {
    const deadline = Date.now() + 180_000;

    while (generation === this.generation) {
      const status = await this.request<AnalyzerStatus>('lsp/status', { id: id });

      if (generation !== this.generation) {
        return;
      }

      if (status.health === 'error') {
        throw new Error(status.message || 'Language server failed to start');
      }

      if (status.ready) {
        loading.ready('Language server ready');
        return;
      }

      const task = status.tasks.at(-1);
      loading.stage(task?.title || 'Loading workspace');

      if (task?.percentage !== undefined) {
        loading.progress(task.percentage, 100);
      }

      if (Date.now() >= deadline) {
        throw new Error('Language server startup timed out');
      }

      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  async update(code: string) {
    await this.request('lsp/change', { id: this.id, code });
    this.version++;
    return { diagnostics: [] };
  }

  async diagnostics() {
    const data = await this.request<{ diagnostics: Diagnostic[] }>('lsp/diagnostics', {
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
    const data = await this.request<{ result: Completion[] | { items: Completion[] } | null }>(
      'lsp/completion',
      { id: this.id, position: { line: line - 1, character: column - 1 } },
    );

    const items = Array.isArray(data.result) ? data.result : (data.result?.items ?? []);
    return items.map(item => completionItem(item, line, column));
  }

  async hover(line: number, column: number): Promise<Monaco.languages.Hover | null> {
    const data = await this.request<{
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
    this.loading?.dispose();
    const id = this.id;
    this.id = '';

    if (id) {
      void closeSession(id, this.endpoint);
    }
  }
}
