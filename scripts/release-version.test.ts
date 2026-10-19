import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vite-plus/test';

import { releaseNotes, synchronizeVersions, updateCargoVersion } from './release-version';

describe('前后端共用版本', () => {
  it('只同步 server，不改写依赖版本，并检测遗漏的同步', () => {
    const root = mkdtempSync(join(tmpdir(), 'rust-path-release-'));

    const manifest =
      '[package]\nname = "rust-path-server"\nversion = "0.1.0"\n\n[dependencies]\naxum = "0.8"\n';

    const dependency = '[[package]]\nname = "axum"\nversion = "0.8.0"\n';
    mkdirSync(join(root, 'crates/server'), { recursive: true });
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ name: 'rust-study', version: '0.1.0', private: true }),
    );
    writeFileSync(join(root, 'crates/server/Cargo.toml'), manifest);
    writeFileSync(
      join(root, 'Cargo.lock'),
      `${dependency}\n${manifest.replace('[package]', '[[package]]')}`,
    );

    try {
      // 在隔离目录实际执行 Changesets，验证 private 根包也会生成统一版本和日志。
      mkdirSync(join(root, '.changeset'));
      symlinkSync(
        fileURLToPath(new URL('../node_modules', import.meta.url)),
        join(root, 'node_modules'),
        'junction',
      );
      writeFileSync(
        join(root, '.changeset/config.json'),
        readFileSync(new URL('../.changeset/config.json', import.meta.url)),
      );
      writeFileSync(join(root, '.changeset/fix.md'), '---\n"rust-study": patch\n---\n\n同步发布\n');
      execFileSync(
        process.execPath,
        [fileURLToPath(import.meta.resolve('@changesets/cli/bin.js')), 'version'],
        { cwd: root, stdio: 'pipe' },
      );
      expect(() => synchronizeVersions(root)).toThrow('不一致');
      expect(synchronizeVersions(root, true)).toBe('0.1.1');
      expect(synchronizeVersions(root)).toBe('0.1.1');

      const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
      expect(releaseNotes(changelog, '0.1.1')).toContain('同步发布');
      expect(readFileSync(join(root, 'Cargo.lock'), 'utf8')).toContain(dependency);
      expect(readFileSync(join(root, 'crates/server/Cargo.toml'), 'utf8')).toContain(
        'axum = "0.8"',
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('server 包不存在时拒绝静默修改其他包', () => {
    expect(() =>
      updateCargoVersion('[[package]]\nname = "axum"\nversion = "0.8.0"\n', '[[package]]', '1.0.0'),
    ).toThrow('无法唯一定位');
  });

  it('只提取当前版本日志，不混入旧版本，也不误匹配版本前缀', () => {
    const changelog =
      '# Changelog\r\n\r\n## 0.2.10\r\n\r\n新版本\r\n\r\n## 0.2.1\r\n\r\n### Patch Changes\r\n\r\n- 修复\r\n\r\n## 0.1.0\r\n\r\n旧版本\r\n';

    expect(releaseNotes(changelog, '0.2.1')).toBe('### Patch Changes\n\n- 修复');
    expect(releaseNotes(changelog, '0.2.0')).toBe('');
  });
});
