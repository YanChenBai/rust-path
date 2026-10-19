export interface AssessmentDefinition {
  answer: string;
  explanation: string;
  mode?: string;
  tests?: string;
  source?: string;
}

export interface Assessment extends AssessmentDefinition {
  accept?: (input: string) => boolean;
}

export function buildAssessments(
  definitions: Record<string, AssessmentDefinition>,
): Record<string, Assessment> {
  return Object.fromEntries(
    Object.entries(definitions).map(([id, entry]) => {
      if (entry.tests) {
        return [id, entry];
      }

      const normalize = (input: string) => {
        const value = String(input).trim();

        if (entry.mode === 'exact') {
          return value;
        }

        const folded = value.toLowerCase();
        return entry.mode === 'call' ? folded.replace(/\(\)$/, '') : folded;
      };

      return [
        id,
        { ...entry, accept: (input: string) => normalize(input) === normalize(entry.answer) },
      ];
    }),
  );
}
