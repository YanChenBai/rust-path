export interface TextAnnotation {
  id: string;
  quote: string;
  prefix: string;
  suffix: string;
  start: number;
  end: number;
  body: string;
  createdAt: number;
}

export function locateAnnotation(
  text: string,
  anchor: Pick<TextAnnotation, 'quote' | 'prefix' | 'suffix' | 'start'>,
) {
  if (!anchor.quote) {
    return;
  }

  let best = -1;
  let bestScore = -1;
  let offset = text.indexOf(anchor.quote);

  while (offset !== -1) {
    const before = text.slice(Math.max(0, offset - anchor.prefix.length), offset);

    const after = text.slice(
      offset + anchor.quote.length,
      offset + anchor.quote.length + anchor.suffix.length,
    );

    const score = Number(before === anchor.prefix) + Number(after === anchor.suffix);

    if (
      score > bestScore ||
      (score === bestScore && Math.abs(offset - anchor.start) < Math.abs(best - anchor.start))
    ) {
      best = offset;
      bestScore = score;
    }

    offset = text.indexOf(anchor.quote, offset + 1);
  }

  return best < 0 ? undefined : { start: best, end: best + anchor.quote.length };
}
