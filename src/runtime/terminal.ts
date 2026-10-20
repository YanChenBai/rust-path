import AnsiToHtml from 'ansi-to-html';

export function terminalHtml(text: string): string {
  const html = new AnsiToHtml({
    escapeXML: true,
    newline: false,
    fg: '#d4d4d4',
    bg: '#111111',
  }).toHtml(text);

  if (text.includes('\u001b[')) {
    return html;
  }

  // 浏览器工具链也会输出无 ANSI 颜色的诊断，只标记诊断前缀，保留原文。
  return html.replace(
    /^(\s*)(warning(?:\[[^\]\n]+\])?|error(?:\[[^\]\n]+\])?|note|help)(:)/gm,
    (_match, space: string, level: string, colon: string) => {
      let color = '#79c0ff';

      if (level.startsWith('warning')) {
        color = '#e3b341';
      } else if (level.startsWith('error')) {
        color = '#ff7b72';
      }

      return `${space}<span style="color:${color}">${level}${colon}</span>`;
    },
  );
}
