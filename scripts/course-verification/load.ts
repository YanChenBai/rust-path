import { createHash } from 'node:crypto';

import { loadCourseDocuments, loadCourseSources } from '../../plugins/course-sources';
import { buildAssessments } from '../../src/runtime/assessment-definitions';
import { buildDocuments } from '../../src/runtime/course-documents';
import type { CourseData, Report } from './types';

export async function loadData(root: string, report: Report): Promise<CourseData> {
  const [files, codes] = await Promise.all([loadCourseDocuments(root), loadCourseSources(root)]);

  for (const [path, source] of Object.entries({
    ...files,
    ...Object.fromEntries(Object.entries(codes).map(([path, code]) => [`course/${path}`, code])),
  })) {
    report.sources[path] = createHash('sha256').update(source).digest('hex');
  }

  const documents = buildDocuments(files, codes);
  return { ...documents, assessments: buildAssessments(documents.assessmentDefinitions) };
}
