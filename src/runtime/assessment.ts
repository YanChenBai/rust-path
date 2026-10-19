import { runRust, type RunOptions } from './rust';

export const testMarker = '__RUST_PATH_TESTS_OK__';

export async function checkProgram(source: string, assertions: string, options: RunOptions = {}) {
  // 给示例入口改名，保证评测实际调用函数并执行边界断言。
  const code = source.replace(/\bfn\s+main\s*\(/g, 'fn example_main(');

  const result = await runRust(
    `${code}\nfn main() { ${assertions} println!("${testMarker}"); }`,
    options,
  );

  return { ...result, success: result.success && result.stdout.includes(testMarker) };
}
