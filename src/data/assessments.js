import content from './assessment-content.json' with { type: 'json' };

export const assessments = Object.fromEntries(
  Object.entries(content).map(([id, entry]) => {
    if (entry.tests) {
      return [id, entry];
    }

    const normalize = input => {
      const value = String(input).trim();

      if (entry.mode === 'exact') {
        return value;
      }

      const folded = value.toLowerCase();
      return entry.mode === 'call' ? folded.replace(/\(\)$/, '') : folded;
    };

    return [id, { ...entry, accept: input => normalize(input) === normalize(entry.answer) }];
  }),
);
