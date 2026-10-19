export interface Assessment {
  answer: string;
  explanation: string;
  accept?: (input: string) => boolean;
  tests?: string;
}

export const assessments: Record<string, Assessment>;
