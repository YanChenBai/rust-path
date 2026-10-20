import { parse } from 'yaml';

import type { AssessmentDefinition } from './assessment-definitions';
import { courseSource, sourceReference } from './course-code';
import type { Chapter, Lesson, Question } from './course-types';

export interface Guide {
  title: string;
  paragraphs: string[];
  code?: string;
  mistake?: string;
  document: string;
  codeSource?: string;
}

function validateDocumentPath(metadata: Record<string, unknown>, document: string) {
  const match = /^\d{2}-([^/]+)\/(.+)$/.exec(document);

  const paths: Record<string, string> = {
    chapter: 'chapter.md',
    lesson: `lessons/${String(metadata.id)}.md`,
    question: `questions/${String(metadata.id)}.md`,
    project: 'project.md',
    guide: `guides/${String(metadata.lessonId)}-${String(metadata.index)}.md`,
  };

  if (!match || paths[String(metadata.type)] !== match[2]) {
    throw new Error(`${document} 不符合固定教程目录结构`);
  }

  const chapterId = metadata.type === 'chapter' ? metadata.id : metadata.chapterId;

  if (chapterId && chapterId !== match[1]) {
    throw new Error(`${document} 的所属章节与目录不一致`);
  }
}

export function parseDocument(source: string, sources: Record<string, string> = {}) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source.replace(/\r\n?/g, '\n'));

  if (!match) {
    throw new Error('教程缺少 YAML frontmatter');
  }

  const metadata = parse(match[1]!) as Record<string, unknown>;

  if (
    !metadata ||
    typeof metadata !== 'object' ||
    Array.isArray(metadata) ||
    typeof metadata.type !== 'string'
  ) {
    throw new Error('教程 frontmatter 必须包含 type');
  }

  const references: (string | undefined)[] = [];

  const body = match[2]!
    .trim()
    .replace(/^```([^\n]*)\n([\s\S]*?)\n```/gm, (fence: string, info: string, code: string) => {
      const reference = sourceReference(info);
      references.push(reference);

      if (!reference) {
        return fence;
      }

      if (code.trim()) {
        throw new Error(`外部源码围栏不能重复定义代码：${reference}`);
      }

      return `\`\`\`${info.replace(/\s+source=\S+/, '')}\n${courseSource(sources, reference)}\n\`\`\``;
    });

  const blocks: { info: string; code: string; source?: string }[] = [
    ...body.matchAll(/^```([^\n]*)\n([\s\S]*?)\n```/gm),
  ].map((item, index) => ({
    info: item[1]!,
    code: item[2]!,
    ...(references[index] ? { source: references[index] } : {}),
  }));

  return { metadata, body, blocks };
}

export function buildDocuments(
  files: Record<string, string>,
  sources: Record<string, string> = {},
) {
  const assessmentDefinitions: Record<string, AssessmentDefinition> = {};
  const advancedLessonIds: string[] = [];
  const revisedLegacyIds: string[] = [];
  const chapters: Chapter[] = [];
  const lessons: (Lesson & { chapterId: string; order: number })[] = [];
  const questions: (Question & { chapterId: string; order: number })[] = [];
  const projects = new Map<string, Chapter['project']>();
  const guideEntries: { lessonId: string; index: number; guide: Guide }[] = [];

  for (const [document, source] of Object.entries(files)) {
    const { metadata, body, blocks } = parseDocument(source, sources);
    validateDocumentPath(metadata, document);
    const { assessment, ...fields } = metadata;
    const entry = { ...fields, document };

    if (assessment) {
      const definition = assessment as {
        answer?: string;
        explanation: string;
        mode?: string;
        answerSource?: string;
        testsSource?: string;
      };

      const answerSource = definition.answerSource;
      assessmentDefinitions[String(metadata.id)] = {
        answer: answerSource ? courseSource(sources, answerSource) : (definition.answer ?? ''),
        explanation: definition.explanation,
        mode: definition.mode,
        tests: definition.testsSource ? courseSource(sources, definition.testsSource) : undefined,
        source: answerSource?.split('?')[0],
      };
    }

    if (metadata.advanced === true) {
      advancedLessonIds.push(String(metadata.id));
    }

    if (metadata.revisedLegacy === true) {
      revisedLegacyIds.push(String(metadata.id));
    }

    switch (metadata.type) {
      case 'chapter': {
        chapters.push({
          ...entry,
          description: body,
          lessons: [],
          questions: [],
          project: {},
        } as unknown as Chapter);
        break;
      }

      case 'lesson': {
        const intro = body.split('<CourseCallout')[0]!.trim();
        const [heading, ...detail] = intro.split('\n');
        const code = blocks.find(block => block.info.includes('playground'))?.code;

        const callouts = [
          ...body.matchAll(/<CourseCallout[^>]*>\s*([\s\S]*?)\s*<\/CourseCallout>/g),
        ];

        if (!code) {
          throw new Error(`${document} 缺少 playground 示例`);
        }

        lessons.push({
          ...entry,
          concept: heading!.replace(/^## /, ''),
          detail: detail.join('\n').trim(),
          tip: callouts[0]?.[1]?.trim() ?? '',
          task: callouts.at(-1)?.[1]?.trim() ?? '',
          code,
          codeSource: blocks.find(block => block.info.includes('playground'))?.source,
        } as (typeof lessons)[number]);
        break;
      }

      case 'question': {
        questions.push({
          ...entry,
          prompt: body.replace(/^```rust starter\n[\s\S]*?\n```/gm, '').trim(),
          starter: blocks.find(block => block.info === 'rust starter')?.code,
        } as (typeof questions)[number]);
        break;
      }

      case 'project': {
        const [description, requirements] = body.split('## 验收要求');
        projects.set(String(metadata.chapterId), {
          title: String(metadata.title),
          document,
          description: description!.trim(),
          requirements: requirements!
            .split('\n')
            .filter(line => line.startsWith('- '))
            .map(line => line.slice(2)),
          starter: blocks.find(block => block.info === 'rust starter')!.code,
        });
        break;
      }

      case 'guide': {
        const paragraphs = body
          .replace(/^### .*\n/, '')
          .split(/```|<CourseCallout/)[0]!
          .trim()
          .split('\n\n')
          .filter(Boolean);

        guideEntries.push({
          lessonId: String(metadata.lessonId),
          index: Number(metadata.index),
          guide: {
            title: String(metadata.title),
            paragraphs,
            document,
            code: blocks[0]?.code,
            codeSource: blocks[0]?.source,
            mistake: metadata.mistake as string | undefined,
          },
        });
        break;
      }

      default: {
        throw new Error(`${document} 的教程类型无效`);
      }
    }
  }

  chapters.sort((a, b) => Number(a.icon) - Number(b.icon));

  for (const chapter of chapters) {
    chapter.lessons = lessons
      .filter(item => item.chapterId === chapter.id)
      .sort((a, b) => a.order - b.order);
    chapter.questions = questions
      .filter(item => item.chapterId === chapter.id)
      .sort((a, b) => a.order - b.order);
    chapter.project = projects.get(chapter.id)!;

    if (!chapter.project || !chapter.lessons.length) {
      throw new Error(`${chapter.id} 的课时或项目不完整`);
    }
  }

  const lessonGuides: Record<string, Guide[]> = {};

  for (const { lessonId, guide } of guideEntries.sort((a, b) => a.index - b.index)) {
    (lessonGuides[lessonId] ??= []).push(guide);
  }

  return {
    chapters,
    allLessons: chapters.flatMap(chapter => chapter.lessons),
    lessonGuides,
    assessmentDefinitions,
    advancedLessonIds,
    revisedLegacyIds,
  };
}
