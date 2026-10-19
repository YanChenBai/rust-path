import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const serverName = 'rust-path-server';

// 按包段落定位版本，避免误改依赖或课程 workspace。
export function cargoPackageBlock(source: string, section: string) {
  const blocks = source.split(/(?=^\[)/m);

  const matches = blocks.filter(
    block => block.startsWith(`${section}\n`) && block.includes(`name = "${serverName}"\n`),
  );

  if (matches.length !== 1 || !/^version = "[^"]+"$/m.test(matches[0]!)) {
    throw new Error(`无法唯一定位 ${section} 中的 ${serverName} 版本`);
  }

  return matches[0]!;
}

export function updateCargoVersion(source: string, section: string, version: string) {
  const block = cargoPackageBlock(source, section);
  return source.replace(block, block.replace(/^version = "[^"]+"$/m, `version = "${version}"`));
}

export function projectVersion(root: string) {
  const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('发布版本必须是稳定的 major.minor.patch');
  }

  return version;
}

export function synchronizeVersions(root: string, write = false) {
  const version = projectVersion(root);

  for (const [file, section] of [
    ['crates/server/Cargo.toml', '[package]'],
    ['Cargo.lock', '[[package]]'],
  ] as const) {
    const path = resolve(root, file);
    const source = readFileSync(path, 'utf8');
    const updated = updateCargoVersion(source.replaceAll('\r\n', '\n'), section, version);

    if (write) {
      writeFileSync(path, updated);
    } else if (updated !== source.replaceAll('\r\n', '\n')) {
      throw new Error(`${file} 与前端版本 ${version} 不一致，请运行 vp run version:release`);
    }
  }

  return version;
}

export function releaseNotes(changelog: string, version: string) {
  const heading = `## ${version}\n`;
  const normalized = changelog.replaceAll('\r\n', '\n');
  const start = normalized.indexOf(heading);

  if (start === -1) {
    return '';
  }

  const content = normalized.slice(start + heading.length);
  const end = content.search(/^## /m);
  return (end === -1 ? content : content.slice(0, end)).trim();
}
