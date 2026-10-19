export const dependencies: Record<string, string>;

export interface NativeCapabilities {
  native: boolean;
  rustc: string | null;
  cargo: string | null;
  dependencies: string[];
}

export interface NativeRunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  elapsed: number;
  outputExceeded: boolean;
}

export function manifest(selected?: string[]): string;

export function runNative(
  body: {
    code: string;
    mode?: 'run' | 'check' | 'build' | 'test';
    dependencies?: string[];
    requestId?: string;
  },
  options?: { onOutput?: (channel: 'stdout' | 'stderr', chunk: Uint8Array) => void },
): Promise<NativeRunResult>;

export function handleNative(path: '/api/capabilities', body: unknown): Promise<NativeCapabilities>;

export function handleNative(path: string, body: unknown): Promise<unknown>;

export function closeRust(): Promise<void>;
