import type { IRange, editor } from 'monaco-editor/editor/editor.api.js';

interface Token {
  offset: number;
  type: string;
}

export interface CommentPresentation {
  hiddenLines: IRange[];
  inlineComments: IRange[];
}

// 由 Monaco 的 Rust 分词结果识别注释，不能用 // 正则误删 URL 或字符串内容。
export function commentPresentation(lines: string[], tokens: Token[][]): CommentPresentation {
  const hiddenLines: IRange[] = [];
  const inlineComments: IRange[] = [];
  lines.forEach((line, index) => {
    const lineTokens = tokens[index] ?? [];
    const comments: IRange[] = [];
    let hasCode = false;

    for (let i = 0; i < lineTokens.length; i++) {
      const token = lineTokens[i]!;
      const end = lineTokens[i + 1]?.offset ?? line.length;

      if (!line.slice(token.offset, end).trim()) {
        continue;
      }

      if (token.type.split('.').includes('comment')) {
        comments.push({
          startLineNumber: index + 1,
          endLineNumber: index + 1,
          startColumn: token.offset + 1,
          endColumn: end + 1,
        });
      } else {
        hasCode = true;
      }
    }

    if (!hasCode && comments.length) {
      hiddenLines.push({
        startLineNumber: index + 1,
        endLineNumber: index + 1,
        startColumn: 1,
        endColumn: line.length + 1,
      });
    } else {
      inlineComments.push(...comments);
    }
  });
  return { hiddenLines, inlineComments };
}

// 固定 Monaco 0.57 提供此视图接口，但尚未写入公开类型；只改变显示，不修改源码模型。
export type CommentAwareEditor = editor.IStandaloneCodeEditor & {
  setHiddenAreas(ranges: IRange[], source?: unknown): void;
};
