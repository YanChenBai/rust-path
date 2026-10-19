import { parse } from 'yaml';

import type { Chapter, Lesson, Question } from '../data/course-types';

export interface Guide {
  title: string;
  paragraphs: string[];
  code?: string;
  mistake?: string;
  document: string;
}

export function parseDocument(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);

  if (!match) {
    throw new Error('教材缺少 YAML frontmatter');
  }

  const metadata = parse(match[1]!) as Record<string, unknown>;

  if (
    !metadata ||
    typeof metadata !== 'object' ||
    Array.isArray(metadata) ||
    typeof metadata.type !== 'string'
  ) {
    throw new Error('教材 frontmatter 必须包含 type');
  }

  const body = match[2]!.trim();

  const blocks = [...body.matchAll(/^```([^\n]*)\n([\s\S]*?)\n```/gm)].map(item => ({
    info: item[1]!,
    code: item[2]!,
  }));

  return { metadata, body, blocks };
}

export function buildDocuments(files: Record<string, string>) {
  const chapters: Chapter[] = [];
  const lessons: (Lesson & { chapterId: string; order: number })[] = [];
  const questions: (Question & { chapterId: string; order: number })[] = [];
  const projects = new Map<string, Chapter['project']>();
  const guideEntries: { lessonId: string; index: number; guide: Guide }[] = [];

  for (const [document, source] of Object.entries(files)) {
    const { metadata, body, blocks } = parseDocument(source);
    const entry = { ...metadata, document };

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
            mistake: metadata.mistake as string | undefined,
          },
        });
        break;
      }

      default: {
        throw new Error(`${document} 的教材类型无效`);
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

  return { chapters, allLessons: chapters.flatMap(chapter => chapter.lessons), lessonGuides };
}
