import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { logger } from './logger';
import { releaseNotes, synchronizeVersions } from './release-version';

const root = fileURLToPath(new URL('../', import.meta.url));
const command = process.argv[2];

if (command === 'version') {
  execFileSync(
    process.execPath,
    [fileURLToPath(import.meta.resolve('@changesets/cli/bin.js')), 'version'],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );
}

if (!['version', 'check', 'plan'].includes(command ?? '')) {
  throw new Error('用法：release.ts version | check | plan');
}

const version = synchronizeVersions(root, command === 'version');
logger.info(`前端与 server 版本：${version}`);

if (command === 'plan') {
  const changelog = new URL('../CHANGELOG.md', import.meta.url);
  const notes = existsSync(changelog) ? releaseNotes(readFileSync(changelog, 'utf8'), version) : '';

  // 初次接入或普通功能提交没有对应版本日志，不自动发布。
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `ready=${Boolean(notes)}\nversion=${version}\ntag=v${version}\n`,
    );
  }

  if (notes && process.env.RELEASE_NOTES_FILE) {
    writeFileSync(process.env.RELEASE_NOTES_FILE, `${notes}\n`);
  }
}
