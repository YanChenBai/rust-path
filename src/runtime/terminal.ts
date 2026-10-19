import AnsiToHtml from 'ansi-to-html';

export function terminalHtml(text: string): string {
  return new AnsiToHtml({ escapeXML: true, newline: false, fg: '#d4d4d4', bg: '#111111' }).toHtml(
    text,
  );
}
