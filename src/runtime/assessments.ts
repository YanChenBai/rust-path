import definitions from 'virtual:course-assessments';

import { buildAssessments } from './assessment-definitions';

export type { Assessment } from './assessment-definitions';

export const assessments = buildAssessments(definitions);
