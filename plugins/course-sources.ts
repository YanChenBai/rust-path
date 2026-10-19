import { readFile, readdir } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

import { sourceRegions } from '../src/runtime/course-code';

export async function loadCourseSources(root: string, onRead?: (path: string) => void) {
  const directory = resolve(root, 'course');
  const sources: Record<string, string> = {};

  // 只读取固定的章节目录，避免遍历 Cargo target 或其他生成目录。
  const chapters = (await readdir(directory, { withFileTypes: true })).filter(
    entry => entry.isDirectory() && /^\d{2}-/.test(entry.name),
  );

  const entries = (
    await Promise.all(
      chapters.map(chapter =>
        readdir(resolve(directory, chapter.name), { recursive: true, withFileTypes: true }),
      ),
    )
  ).flat();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.rs')) {
      continue;
    }

    const path = resolve(entry.parentPath, entry.name);
    const key = relative(directory, path).replaceAll('\\', '/');
    const source = (await readFile(path, 'utf8')).replace(/\r\n?/g, '\n').replace(/\n$/, '');
    sources[key] = source;
    onRead?.(path);

    for (const [region, code] of Object.entries(sourceRegions(source))) {
      sources[`${key}?region=${region}`] = code;
    }
  }

  return sources;
}

export async function loadCourseDocuments(root: string, onRead?: (path: string) => void) {
  const directory = resolve(root, 'src/docs');
  const files: Record<string, string> = {};
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || resolve(entry.parentPath) === directory) {
      continue;
    }

    const path = resolve(entry.parentPath, entry.name);
    files[relative(directory, path).replaceAll('\\', '/')] = await readFile(path, 'utf8');
    onRead?.(path);
  }

  return files;
}
