import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const dependencies = {
  tokio: 'tokio = { version = "1", features = ["full"] }',
  serde: 'serde = { version = "1", features = ["derive"] }',
  serde_json: 'serde_json = "1"',
  anyhow: 'anyhow = "1"',
  thiserror: 'thiserror = "2"',
  reqwest:
    'reqwest = { version = "0.12", default-features = false, features = ["json", "rustls-tls"] }',
  clap: 'clap = { version = "4", features = ["derive"] }',
  tracing: 'tracing = "0.1"',
  rusqlite: 'rusqlite = { version = "0.37", features = ["bundled"] }',
};

const sessions = new Map();
const commands = new Map();
const children = new Set();
const childClosed = new WeakMap();
const terminations = new WeakMap();
const operations = new Set();
const target = join(tmpdir(), 'rust-path-cargo-target');
const compilerOutputLimit = 16 * 1024 * 1024;
let active = 0;
let closing = false;
let closePromise;

function track(operation) {
  operations.add(operation);
  operation.then(
    () => operations.delete(operation),
    () => operations.delete(operation),
  );
  return operation;
}

function trackChild(child) {
  children.add(child);
  childClosed.set(
    child,
    new Promise(resolve => {
      child.once('close', () => {
        children.delete(child);
        resolve();
      });
    }),
  );
  return child;
}

function ensureOpen() {
  if (closing) {
    throw new Error('Rust 工具链服务正在关闭');
  }
}

function validateCode(code) {
  if (typeof code !== 'string' || code.length > 100000) {
    throw new Error('代码必须为字符串且不超过 100000 字符');
  }
}

export function manifest(selected = []) {
  if (
    !Array.isArray(selected) ||
    selected.some(name => typeof name !== 'string' || !Object.hasOwn(dependencies, name))
  ) {
    throw new Error('存在未支持的依赖');
  }

  const entries = [...new Set(selected)].map(name => dependencies[name]);
  return `[package]\nname = "rust_path_scratch"\nversion = "0.1.0"\nedition = "2024"\n\n[dependencies]\n${entries.join('\n')}\n\n[profile.release]\nopt-level = 3\n`;
}

async function removeProject(directory) {
  if (!directory) {
    return;
  }

  try {
    await rm(directory, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 });
  } catch (error) {
    console.warn('Rust 临时目录清理失败：', error);
  }
}

async function project(code, selected) {
  ensureOpen();
  validateCode(code);
  // 依赖仍复用编译缓存，但每次运行使用独立产物，避免 Windows 锁住正在运行的 exe。
  const binaryName = `rust_path_${randomUUID().replaceAll('-', '')}`;
  const config = `${manifest(selected)}\n[[bin]]\nname = "${binaryName}"\npath = "src/main.rs"\n`;
  const directory = await mkdtemp(join(tmpdir(), 'rust-path-'));

  try {
    await mkdir(join(directory, 'src'));
    await writeFile(join(directory, 'Cargo.toml'), config);
    await writeFile(join(directory, 'src/main.rs'), code);
    ensureOpen();
    return directory;
  } catch (error) {
    await removeProject(directory);
    throw error;
  }
}

function killParent(child) {
  try {
    child.kill('SIGKILL');
  } catch (error) {
    console.warn('Rust 子进程终止失败：', error);
  }
}

function killTree(child) {
  if (!child.pid) {
    return Promise.resolve();
  }

  if (process.platform !== 'win32') {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      killParent(child);
    }

    return Promise.resolve();
  }

  return new Promise(resolve => {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
      windowsHide: true,
      stdio: 'ignore',
    });

    killer.once('error', () => {
      killParent(child);
      resolve();
    });
    killer.once('close', exit => {
      if (exit !== 0) {
        killParent(child);
      }

      resolve();
    });
  });
}

function terminate(child) {
  if (!child || !children.has(child)) {
    return Promise.resolve();
  }

  let termination = terminations.get(child);

  if (!termination) {
    termination = killTree(child).then(() => childClosed.get(child));
    terminations.set(child, termination);
  }

  return termination;
}

function outputBuffer(limit, onLimit) {
  const chunks = [];
  let size = 0;
  let exceeded = false;

  return {
    append(chunk) {
      const available = Math.max(0, limit - size);
      chunks.push(chunk.subarray(0, available));
      size += Math.min(chunk.length, available);

      if (chunk.length > available && !exceeded) {
        exceeded = true;
        onLimit();
      }
    },
    text: () => Buffer.concat(chunks, size).toString('utf8'),
  };
}

function command(cmd, args, cwd, requestId, options = {}) {
  ensureOpen();
  const { timeout = 120000, outputLimit = 64000, onOutput } = options;

  return new Promise((resolve, reject) => {
    const child = trackChild(
      spawn(cmd, args, {
        cwd,
        windowsHide: true,
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, CARGO_TARGET_DIR: target },
      }),
    );

    if (requestId) {
      commands.set(requestId, child);
    }

    let reason = '';

    const stop = message => {
      reason ||= message;
      void terminate(child);
    };

    const stdout = outputBuffer(outputLimit, () => stop(`输出超过 ${outputLimit} 字节，已停止。`));
    const stderr = outputBuffer(outputLimit, () => stop(`输出超过 ${outputLimit} 字节，已停止。`));

    const timer = setTimeout(
      () => stop(`执行超过 ${timeout / 1000} 秒，已停止。首次依赖构建可重试以利用缓存。`),
      timeout,
    );

    const release = () => {
      clearTimeout(timer);

      if (commands.get(requestId) === child) {
        commands.delete(requestId);
      }
    };

    child.stdout.on('data', chunk => {
      stdout.append(chunk);
      onOutput?.('stdout', chunk);
    });
    child.stderr.on('data', chunk => {
      stderr.append(chunk);
      onOutput?.('stderr', chunk);
    });
    child.once('error', error => {
      release();
      reject(error);
    });
    child.once('close', exit => {
      release();
      resolve({
        success: exit === 0 && !reason,
        stdout: stdout.text(),
        stderr: [stderr.text(), reason].filter(Boolean).join('\n'),
        outputExceeded: reason.startsWith('输出超过'),
      });
    });
  });
}

async function executeNative(body, options = {}) {
  ensureOpen();

  if (active >= 2) {
    throw new Error('已有两个 Cargo 任务运行，请稍后重试');
  }

  const mode = body.mode ?? 'run';

  if (!['run', 'check', 'build', 'test'].includes(mode)) {
    throw new Error('不支持的 Cargo 命令');
  }

  active++;
  let directory;

  try {
    directory = await project(body.code, body.dependencies ?? []);
    const start = Date.now();

    const result = await command(
      'cargo',
      options.onOutput ? [mode, '--color=always'] : [mode, '--quiet', '--color=never'],
      directory,
      body.requestId,
      options,
    );

    return { ...result, elapsed: Date.now() - start };
  } finally {
    active--;
    await removeProject(directory);
  }
}

export function runNative(body, options = {}) {
  return track(executeNative(body, options));
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function isMainSpan(span) {
  return span.is_primary && span.file_name.replaceAll('\\', '/').endsWith('main.rs');
}

function compilerDiagnostics(stdout) {
  return stdout.split('\n').flatMap(line => {
    const item = parseJson(line);

    if (item?.reason !== 'compiler-message') {
      return [];
    }

    const message = item.message;
    return message.spans.filter(isMainSpan).map(span => ({
      message: message.message,
      code: message.code?.code,
      severity: message.level === 'error' ? 1 : 2,
      source: 'rustc',
      range: {
        start: { line: span.line_start - 1, character: span.column_start - 1 },
        end: { line: span.line_end - 1, character: span.column_end - 1 },
      },
    }));
  });
}

function checkFailure(message) {
  return {
    message,
    severity: 2,
    source: 'cargo',
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
  };
}

class Analyzer {
  pending = new Map();
  buffer = Buffer.alloc(0);
  sequence = 0;
  version = 1;
  diagnostics = [];
  compilerDiagnostics = [];
  checkTimer;
  checkTasks = new Set();
  changeQueue = Promise.resolve();
  source = '';
  checkId = randomUUID();
  touched = Date.now();
  disposed = false;
  disposePromise;
  failure;

  async start(code, selected) {
    this.directory = await project(code, selected);
    this.source = code;
    this.uri = pathToFileURL(join(this.directory, 'src/main.rs')).href;
    this.child = trackChild(
      spawn('rust-analyzer', [], {
        cwd: this.directory,
        windowsHide: true,
        detached: process.platform !== 'win32',
        stdio: ['pipe', 'pipe', 'ignore'],
        env: { ...process.env, CARGO_TARGET_DIR: target },
      }),
    );
    this.child.on('error', error => this.fail(error));
    this.child.on('exit', () => this.fail(new Error('rust-analyzer 已停止')));
    this.child.stdin.on('error', error => this.fail(error));
    this.child.stdout.on('data', chunk => this.receive(chunk));
    await this.request('initialize', {
      processId: process.pid,
      rootUri: pathToFileURL(this.directory).href,
      capabilities: {
        general: { positionEncodings: ['utf-16'] },
        textDocument: {
          completion: { completionItem: { snippetSupport: true } },
          hover: { contentFormat: ['markdown', 'plaintext'] },
          publishDiagnostics: { relatedInformation: true },
        },
      },
      initializationOptions: {
        checkOnSave: false,
        cargo: { buildScripts: { enable: true } },
        procMacro: { enable: true },
      },
    });
    this.notify('initialized', {});
    this.notify('textDocument/didOpen', {
      textDocument: { uri: this.uri, languageId: 'rust', version: 1, text: code },
    });
    this.notify('textDocument/didSave', { textDocument: { uri: this.uri } });
    this.scheduleCheck();
  }

  receive(chunk) {
    if (this.disposed) {
      return;
    }

    this.buffer = Buffer.concat([this.buffer, chunk]);

    try {
      this.readMessages();
    } catch (error) {
      this.fail(error);
      void track(this.dispose());
    }
  }

  readMessages() {
    while (true) {
      const index = this.buffer.indexOf('\r\n\r\n');

      if (index < 0) {
        return;
      }

      const length = Number(
        /Content-Length: (\d+)/i.exec(this.buffer.subarray(0, index).toString())?.[1],
      );

      if (!Number.isSafeInteger(length) || length <= 0) {
        throw new Error('rust-analyzer 消息头无效');
      }

      if (this.buffer.length < index + 4 + length) {
        return;
      }

      const data = JSON.parse(this.buffer.subarray(index + 4, index + 4 + length).toString());
      this.buffer = this.buffer.subarray(index + 4 + length);
      this.handleMessage(data);
    }
  }

  handleMessage(data) {
    if (
      data.method === 'textDocument/publishDiagnostics' &&
      data.params.uri.toLowerCase() === this.uri.toLowerCase()
    ) {
      this.diagnostics = data.params.diagnostics;
    }

    if (data.method && data.id !== undefined) {
      this.send({
        id: data.id,
        result:
          data.method === 'workspace/configuration' ? data.params.items.map(() => null) : null,
      });
    }

    const item = this.pending.get(data.id);

    if (!item) {
      return;
    }

    this.pending.delete(data.id);

    if (data.error) {
      item.reject(new Error(data.error.message));
      return;
    }

    item.resolve(data.result);
  }

  fail(error) {
    this.failure = error;

    for (const item of this.pending.values()) {
      item.reject(error);
    }

    this.pending.clear();
  }

  send(data) {
    if (this.disposed || this.failure) {
      throw this.failure ?? new Error('会话已关闭');
    }

    const body = JSON.stringify({ jsonrpc: '2.0', ...data });
    this.child.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
  }

  notify(method, params) {
    this.send({ method, params });
  }

  request(method, params) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('rust-analyzer 响应超时'));
      }, 30000);

      const item = {
        resolve: value => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: error => {
          clearTimeout(timer);
          reject(error);
        },
      };

      this.pending.set(id, item);

      try {
        this.send({ id, method, params });
      } catch (error) {
        this.pending.delete(id);
        item.reject(error);
      }
    });
  }

  change(code) {
    const update = this.changeQueue.then(() => this.applyChange(code));
    this.changeQueue = update.catch(() => {
      // 向调用方传播本次错误，后续更新仍可排队。
    });
    return update;
  }

  async applyChange(code) {
    validateCode(code);

    if (code === this.source) {
      return;
    }

    this.source = code;
    this.diagnostics = [];
    this.compilerDiagnostics = [];
    this.notify('textDocument/didChange', {
      textDocument: { uri: this.uri, version: ++this.version },
      contentChanges: [{ text: code }],
    });
    await writeFile(join(this.directory, 'src/main.rs'), code);
    this.notify('textDocument/didSave', { textDocument: { uri: this.uri } });
    this.scheduleCheck();
  }

  scheduleCheck() {
    clearTimeout(this.checkTimer);
    void terminate(commands.get(this.checkId));
    const version = this.version;
    this.checkTimer = setTimeout(() => {
      const task = this.check(version);
      this.checkTasks.add(task);
      void task.finally(() => this.checkTasks.delete(task));
    }, 500);
  }

  async check(version) {
    try {
      const result = await command(
        'cargo',
        ['check', '--message-format=json', '--color=never'],
        this.directory,
        this.checkId,
        { outputLimit: compilerOutputLimit },
      );

      if (this.disposed || version !== this.version) {
        return;
      }

      this.compilerDiagnostics = compilerDiagnostics(result.stdout);

      if (result.outputExceeded || (!result.success && this.compilerDiagnostics.length === 0)) {
        this.compilerDiagnostics.push(checkFailure(result.stderr || 'Cargo 实时检查未完成'));
      }
    } catch {
      if (!this.disposed && version === this.version) {
        this.compilerDiagnostics = [
          checkFailure('Cargo 实时检查暂时失败，请运行代码查看工具链详情'),
        ];
      }
    }
  }

  dispose() {
    this.disposePromise ??= this.cleanup();
    return this.disposePromise;
  }

  async cleanup() {
    this.disposed = true;
    clearTimeout(this.checkTimer);
    this.fail(new Error('会话已关闭'));
    await Promise.allSettled([terminate(commands.get(this.checkId)), terminate(this.child)]);
    await this.changeQueue;
    await Promise.allSettled(this.checkTasks);
    await removeProject(this.directory);
  }
}

const sweepTimer = setInterval(() => {
  for (const [id, session] of sessions) {
    if (Date.now() - session.touched > 180000) {
      sessions.delete(id);
      void track(session.dispose());
    }
  }
}, 30000);

sweepTimer.unref();

async function toolVersion(tool) {
  try {
    const result = await command(tool, ['--version'], undefined, undefined, { timeout: 10000 });
    return result.success ? result.stdout.trim() : null;
  } catch {
    return null;
  }
}

async function capabilities() {
  const [rustc, cargo] = await Promise.all([toolVersion('rustc'), toolVersion('cargo')]);
  return { native: Boolean(rustc && cargo), rustc, cargo, dependencies: Object.keys(dependencies) };
}

async function openSession(body) {
  if (sessions.size >= 6) {
    throw new Error('语言服务会话过多，请稍后重试');
  }

  const session = new Analyzer();
  const id = randomUUID();
  sessions.set(id, session);

  try {
    await session.start(body.code, body.dependencies ?? []);
    ensureOpen();
    return { id };
  } catch (error) {
    sessions.delete(id);
    await session.dispose();
    throw error;
  }
}

async function handleSession(path, body) {
  const session = sessions.get(body.id);

  if (!session) {
    throw new Error('语言服务会话已过期，请重新打开编辑器');
  }

  session.touched = Date.now();

  if (path === '/api/lsp/close') {
    sessions.delete(body.id);
    await session.dispose();
    return {};
  }

  if (path === '/api/lsp/change') {
    await session.change(body.code);
    return {};
  }

  if (path === '/api/lsp/diagnostics') {
    return {
      diagnostics: [...session.diagnostics, ...session.compilerDiagnostics],
      version: session.version,
    };
  }

  if (['/api/lsp/hover', '/api/lsp/completion'].includes(path)) {
    return {
      result: await session.request(`textDocument/${path.split('/').at(-1)}`, {
        textDocument: { uri: session.uri },
        position: body.position,
      }),
    };
  }

  throw new Error('未知接口');
}

async function dispatch(path, body) {
  ensureOpen();

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('请求内容必须是对象');
  }

  switch (path) {
    case '/api/capabilities': {
      return capabilities();
    }

    case '/api/run': {
      return runNative(body);
    }

    case '/api/stop': {
      await terminate(commands.get(body.requestId));
      return {};
    }

    case '/api/lsp/open': {
      return openSession(body);
    }

    default: {
      return handleSession(path, body);
    }
  }
}

export function handleNative(path, body) {
  return track(dispatch(path, body));
}

async function shutdown() {
  closing = true;
  clearInterval(sweepTimer);
  await Promise.allSettled([...children].map(terminate));
  await Promise.allSettled(operations);
  await Promise.allSettled([...sessions.values()].map(session => session.dispose()));
  sessions.clear();
  await Promise.allSettled([...children].map(terminate));
  commands.clear();
}

// 供 Nitro close hook 调用；重复关闭复用同一清理任务。
export function closeRust() {
  closePromise ??= shutdown();
  return closePromise;
}
