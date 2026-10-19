import type { Assessment } from '../../src/runtime/assessment-definitions';
import type { buildDocuments } from '../../src/runtime/course-documents';

export type Stage = 'structure' | 'answers' | 'execution';

export type CourseData = ReturnType<typeof buildDocuments> & {
  assessments: Record<string, Assessment>;
  advancedLessonIds: string[];
};

export interface ExecutionJob {
  id: string;
  kind: 'lesson' | 'guide' | 'assessment' | 'project';
  code: string;
  source?: string;
  dependencies: string[];
  requiresMarker?: boolean;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

export interface Execution extends Omit<ExecutionJob, 'code' | 'requiresMarker'> {
  attempts: ExecutionResult[];
  elapsed: number;
  success: boolean;
}

export interface Report {
  startedAt: string;
  finishedAt?: string;
  node: string;
  root: string;
  stages: Stage[];
  skipAdvancedLessons: boolean;
  structureOnly: boolean;
  concurrency: number;
  sources: Record<string, string>;
  totals: Record<string, number>;
  checks: Record<'passed' | 'failed', number>;
  executions: Execution[];
  failures: { stage: Stage | 'fatal'; id: string; message: string; kind?: string }[];
  previousRun?: {
    reportPath: string;
    startedAt: string;
    finishedAt?: string;
    totals: Record<string, number>;
    executed: number;
    passed: number;
    failed: number;
    note: string;
  };
  success?: boolean;
}

export interface VerificationContext {
  report: Report;
  check: (condition: unknown, id: string, message: string, stage: Stage) => boolean;
  saveReport: () => Promise<void>;
}
