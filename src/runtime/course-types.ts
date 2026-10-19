export interface Lesson {
  document?: string;
  reference?: { columns: string[]; rows: string[][] };
  nativeRequired?: boolean;
  dependencies?: string[];
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  concept: string;
  detail: string;
  tip: string;
  task: string;
  code: string;
  codeSource?: string;
}

export interface Question {
  document?: string;
  id: string;
  kind: 'choice' | 'fill' | 'code';
  title: string;
  prompt: string;
  options?: string[];
  starter?: string;
}

export interface Chapter {
  document?: string;
  stage?: string;
  dependencies?: string[];
  nativeRequired?: boolean;
  id: string;
  title: string;
  description: string;
  icon: string;
  source: string;
  lessons: Lesson[];
  questions: Question[];
  project: {
    document?: string;
    title: string;
    description: string;
    requirements: string[];
    starter: string;
  };
}
