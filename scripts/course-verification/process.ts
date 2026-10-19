import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { ExecutionResult } from './types';

interface ProcessOptions {
  cwd: string;
  timeout: number;
  outputLimit: number;
  env?: NodeJS.ProcessEnv;
}

export function runProcess(
  command: string,
  args: string[],
  options: ProcessOptions,
): Promise<ExecutionResult> {
  return new Promise(resolve => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      windowsHide: true,
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let reason = '';
    const chunks = { stdout: [] as Buffer[], stderr: [] as Buffer[] };
    const sizes = { stdout: 0, stderr: 0 };

    function stop(message: string) {
      if (reason) {
        return;
      }

      reason = message;

      if (!child.pid) {
        return;
      }

      if (process.platform === 'win32') {
        const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
          windowsHide: true,
          stdio: 'ignore',
        });

        killer.once('error', () => child.kill());
        killer.once('close', code => {
          if (code !== 0) {
            child.kill();
          }
        });
      } else {
        try {
          process.kill(-child.pid, 'SIGKILL');
        } catch {
          child.kill('SIGKILL');
        }
      }
    }

    const timer = setTimeout(
      () => stop(`timeout：执行超过 ${options.timeout / 1000} 秒`),
      options.timeout,
    );

    for (const channel of ['stdout', 'stderr'] as const) {
      child[channel].on('data', (chunk: Buffer) => {
        const available = Math.max(0, options.outputLimit - sizes[channel]);
        chunks[channel].push(chunk.subarray(0, available));
        sizes[channel] += Math.min(chunk.length, available);

        if (chunk.length > available) {
          stop(`输出超过 ${options.outputLimit} 字节`);
        }
      });
    }

    child.once('error', error => {
      reason = error.message;
    });
    child.once('close', code => {
      clearTimeout(timer);
      resolve({
        success: code === 0 && !reason,
        stdout: Buffer.concat(chunks.stdout).toString('utf8'),
        stderr: [Buffer.concat(chunks.stderr).toString('utf8'), reason].filter(Boolean).join('\n'),
      });
    });
  });
}

export async function runExecutable(executable: string) {
  // 每个程序仍使用独立工作目录，避免读写文件的课程示例互相影响。
  const cwd = await mkdtemp(join(tmpdir(), 'rust-course-run-'));

  try {
    return await runProcess(executable, [], { cwd, timeout: 120_000, outputLimit: 64_000 });
  } finally {
    await rm(cwd, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
  }
}
