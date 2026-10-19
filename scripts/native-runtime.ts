import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { logger, logStep } from './logger';

const execFileAsync = promisify(execFile);

type CommandRunner = (command: string, args: string[], longRunning?: boolean) => Promise<string>;

const runCommand: CommandRunner = async (command, args, longRunning = false) => {
  if (!args.includes('--version')) {
    logStep(`${command} ${args.join(' ')}`, 'run');
  }

  const operation = execFileAsync(command, args, {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    windowsHide: true,
    timeout: longRunning ? 300_000 : 15_000,
  });

  const output = (chunk: string) => {
    const message = chunk.trimEnd();

    if (message) {
      logger.info(message);
    }
  };

  // 所有命令都透传原始输出，版本信息和 rustup 的 stderr 提示不会被摘要吞掉。
  operation.child.stdout?.setEncoding('utf8').on('data', output);
  operation.child.stderr?.setEncoding('utf8').on('data', output);

  const { stdout } = await operation;
  return stdout.trim();
};

async function printCompilerVersions(run: CommandRunner) {
  await run('rustc', ['--version']);
  await run('cargo', ['--version']);
}

// 使用与本机服务相同的活动工具链，避免装到 stable 后仍被项目 override 遮蔽。
export async function ensureRustAnalyzer(run: CommandRunner = runCommand): Promise<boolean> {
  let analyzerAvailable = false;

  try {
    await run('rust-analyzer', ['--version']);
    analyzerAvailable = true;
  } catch {
    // rustup 代理存在但组件未安装时，--version 同样会失败。
  }

  if (analyzerAvailable) {
    await printCompilerVersions(run);
    return true;
  }

  try {
    await run('rustup', ['--version']);
    await run('rustup', ['show', 'active-toolchain']);
  } catch {
    logger.warn(
      '本机 Rust 工具链不可用，跳过 rust-analyzer 安装；浏览器运行资源仍会准备。请安装并配置 rustup 后重跑 prepare:runtime。',
    );
    return false;
  }

  logger.info('安装 rust-analyzer 到当前 Rust 工具链…');
  await run('rustup', ['component', 'add', 'rust-analyzer'], true);
  await printCompilerVersions(run);
  await run('rust-analyzer', ['--version']);
  return true;
}
