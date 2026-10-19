import { styleText } from 'node:util';

import { createLogger } from 'vite-plus';

export const logger = createLogger('info', { prefix: '[rust-path]' });

export function logStep(
  label: string,
  status: 'run' | 'pass' | 'fail' | 'retry',
  elapsed?: number,
) {
  const colors = { run: 'blue', pass: 'green', fail: 'red', retry: 'yellow' } as const;
  const badge = styleText(['bold', colors[status]], status.toUpperCase().padEnd(5));
  const duration = elapsed === undefined ? '' : styleText('dim', `  ${Math.round(elapsed)} ms`);
  const message = `${badge} ${label}${duration}`;

  if (status === 'fail') {
    logger.error(message);
  } else if (status === 'retry') {
    logger.warn(message);
  } else {
    logger.info(message);
  }
}

// 沿用 Vite 启动摘要的层次，颜色由终端能力和 NO_COLOR 等环境变量决定。
export function logReady(label: string, started: number, ready = true) {
  const status = ready ? styleText('green', 'ready') : styleText('red', 'failed');
  const elapsed = styleText('bold', `${Math.round(performance.now() - started)} ms`);
  logger.info(
    `\n${styleText(['bold', 'cyan'], 'RUST PATH')}  ${styleText('dim', label)}  ${status} in ${elapsed}\n`,
  );
}
