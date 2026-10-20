import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { defineConfig, lazyPlugins } from 'vite-plus';
import type {} from 'vite-ssg';

import { courseCatalog } from './plugins/course-catalog';
import { courseMarkdown } from './plugins/markdown-plugin';
import { staticNotFound } from './plugins/static-not-found';
import { projectVersion } from './scripts/release-version';

const courseVerificationCache = {
  env: [
    'RUSTUP_TOOLCHAIN',
    'RUSTUP_HOME',
    'CARGO_HOME',
    'RUSTFLAGS',
    'CARGO_ENCODED_RUSTFLAGS',
    'CARGO_BUILD_TARGET',
    'RUSTC',
    'RUSTC_WRAPPER',
    'RUSTC_WORKSPACE_WRAPPER',
    'PATH',
  ],
  input: [
    'package.json',
    'pnpm-lock.yaml',
    'tsconfig.node.json',
    'scripts/verify-course.ts',
    'scripts/logger.ts',
    'scripts/course-verification/**/*.ts',
    'plugins/course-sources.ts',
    'src/runtime/assessment-definitions.ts',
    'src/runtime/course-code.ts',
    'src/runtime/course-documents.ts',
    'src/runtime/course-types.ts',
    'src/docs/**',
    'course/**/*.rs',
    'course/**/Cargo.toml',
    'course/Cargo.lock',
    '**/rust-toolchain',
    '**/rust-toolchain.toml',
    '.cargo/config',
    '.cargo/config.toml',
    'course/.cargo/config',
    'course/.cargo/config.toml',
    '!course/target/**',
    '!node_modules/**',
    '!.rust-path/**',
  ],
  // 仅恢复本次任务写入的报告；Cargo 编译缓存由 Cargo 自行管理。
  output: [{ auto: true }, '!node_modules/**', '!course/**'],
};

// https://vite.dev/config/
export default defineConfig({
  ssgOptions: {
    // 旧进度模型仍是共享响应式对象，每条路由在渲染前重置并顺序生成。
    concurrency: 1,
    formatting: 'none',
  },
  plugins: lazyPlugins(() => [
    {
      name: 'release-version',
      generateBundle() {
        const version = projectVersion(process.cwd());
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: `${JSON.stringify({ version })}\n`,
        });
      },
    },
    vue({ include: [/\.vue$/, /\.md$/] }),
    courseCatalog(),
    courseMarkdown(),
    staticNotFound(),
    vueDevTools(),
    tailwindcss(),
  ]),

  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  build: {
    outDir: 'dist',
  },

  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },

  resolve: {
    tsconfigPaths: true,
  },

  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },

  run: {
    cache: true,
    tasks: {
      changeset: { command: 'changeset', cache: false },
      'version:release': {
        command: 'oxnode scripts/release.ts version && vp fmt package.json CHANGELOG.md',
        cache: false,
      },
      'check:version': { command: 'oxnode scripts/release.ts check', cache: false },
      dev: 'vp dev',
      'dev:server': {
        command: 'cargo run --locked --package rust-path-server --',
        cache: false,
      },
      'test:server': {
        command: 'cargo test --locked --package rust-path-server',
        cache: false,
      },
      'check:server': {
        command: [
          'cargo fmt --all --check',
          'cargo clippy --locked --workspace --all-targets -- -D warnings',
        ],
        cache: false,
      },
      'build:server': {
        command: 'cargo build --locked --release --package rust-path-server',
        // 编译缓存由 Cargo 负责，不重复归档 target 或搬运可执行文件。
        cache: false,
      },
      build: {
        command: 'vite-ssg build',
        cache: {
          input: [
            { auto: true },
            '!dist/**',
            '!build/**',
            '!.output/**',
            '!.rust-path/**',
            '!course/target/**',
            '!target/**',
          ],
          output: ['dist/**'],
        },
        dependsOn: ['typecheck'],
      },
      typecheck: {
        command: 'vue-tsc --build',
        cache: {
          input: [{ auto: true }, '!**/*.tsbuildinfo', '!dist/**', '!build/**', '!.output/**'],
          output: [],
        },
      },
      preview: 'vp preview',
      'prepare:browser': {
        command: 'oxnode scripts/prepare-browser.ts',
        cache: {
          input: [
            'package.json',
            'pnpm-lock.yaml',
            'tsconfig.node.json',
            'scripts/prepare-browser.ts',
            'scripts/runtime-worker.ts',
            'scripts/logger.ts',
          ],
          output: ['public/runtime/**', 'public/analyzer/**'],
        },
      },
      'verify:course': {
        command: 'oxnode scripts/verify-course.ts',
        cache: courseVerificationCache,
      },
      'verify:course:structure': {
        command: 'oxnode scripts/verify-course.ts --only structure',
        cache: courseVerificationCache,
      },
      'verify:course:answers': {
        command: 'oxnode scripts/verify-course.ts --only answers',
        cache: courseVerificationCache,
      },
      'verify:course:execution': {
        command: 'oxnode scripts/verify-course.ts --only execution',
        cache: courseVerificationCache,
      },
    },
  },

  staged: {
    '*': 'vp check --fix',
  },

  fmt: {
    singleQuote: true,
    sortImports: true,
    sortTailwindcss: true,
    sortPackageJson: true,
    arrowParens: 'avoid',
    embeddedLanguageFormatting: 'auto',
    printWidth: 100,
  },

  lint: {
    jsPlugins: [
      { name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
      { name: 'stylistic', specifier: '@stylistic/eslint-plugin' },
    ],
    rules: {
      'constructor-super': 'warn',
      'for-direction': 'warn',
      'no-async-promise-executor': 'warn',
      'no-caller': 'warn',
      'no-class-assign': 'warn',
      'no-compare-neg-zero': 'warn',
      'no-cond-assign': 'warn',
      'no-const-assign': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-constant-condition': 'warn',
      'no-control-regex': 'warn',
      'no-debugger': 'warn',
      'no-delete-var': 'warn',
      'no-dupe-class-members': 'warn',
      'no-dupe-else-if': 'warn',
      'no-dupe-keys': 'warn',
      'no-duplicate-case': 'warn',
      'no-empty-character-class': 'warn',
      'no-empty-pattern': 'warn',
      'no-empty-static-block': 'warn',
      'no-eval': 'warn',
      'no-ex-assign': 'warn',
      'no-extra-boolean-cast': 'warn',
      'no-func-assign': 'warn',
      'no-global-assign': 'warn',
      'no-import-assign': 'warn',
      'no-invalid-regexp': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-loss-of-precision': 'warn',
      'no-new-native-nonconstructor': 'warn',
      'no-nonoctal-decimal-escape': 'warn',
      'no-obj-calls': 'warn',
      'no-self-assign': 'warn',
      'no-setter-return': 'warn',
      'no-shadow-restricted-names': 'warn',
      'no-sparse-arrays': 'warn',
      'no-this-before-super': 'warn',
      'no-unassigned-vars': 'warn',
      'no-unsafe-finally': 'warn',
      'no-unsafe-negation': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-unused-expressions': 'warn',
      'no-unused-labels': 'warn',
      'no-unused-private-class-members': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-backreference': 'warn',
      'no-useless-catch': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-rename': 'warn',
      'no-with': 'warn',
      'require-yield': 'warn',
      'use-isnan': 'warn',
      'valid-typeof': 'warn',
      'oxc/bad-array-method-on-arguments': 'warn',
      'oxc/bad-char-at-comparison': 'warn',
      'oxc/bad-comparison-sequence': 'warn',
      'oxc/bad-min-max-func': 'warn',
      'oxc/bad-object-literal-comparison': 'warn',
      'oxc/bad-replace-all-arg': 'warn',
      'oxc/const-comparisons': 'warn',
      'oxc/double-comparisons': 'warn',
      'oxc/erasing-op': 'warn',
      'oxc/missing-throw': 'warn',
      'oxc/number-arg-out-of-range': 'warn',
      'oxc/only-used-in-recursion': 'warn',
      'oxc/uninvoked-array-callback': 'warn',
      'typescript/await-thenable': 'warn',
      'typescript/no-array-delete': 'warn',
      'typescript/no-base-to-string': 'warn',
      'typescript/no-duplicate-enum-values': 'warn',
      'typescript/no-duplicate-type-constituents': 'warn',
      'typescript/no-extra-non-null-assertion': 'warn',
      'typescript/no-floating-promises': 'off',
      'typescript/no-for-in-array': 'warn',
      'typescript/no-implied-eval': 'warn',
      'typescript/no-meaningless-void-operator': 'warn',
      'typescript/no-misused-new': 'warn',
      'typescript/no-misused-spread': 'warn',
      'typescript/no-non-null-asserted-optional-chain': 'warn',
      'typescript/no-redundant-type-constituents': 'warn',
      'typescript/no-this-alias': 'warn',
      'typescript/no-unnecessary-parameter-property-assignment': 'warn',
      'typescript/no-unsafe-declaration-merging': 'warn',
      'typescript/no-unsafe-unary-minus': 'warn',
      'typescript/no-useless-empty-export': 'warn',
      'typescript/no-wrapper-object-types': 'warn',
      'typescript/prefer-as-const': 'warn',
      'typescript/require-array-sort-compare': 'warn',
      'typescript/restrict-template-expressions': 'warn',
      'typescript/triple-slash-reference': 'warn',
      'typescript/unbound-method': 'warn',
      'unicorn/no-await-in-promise-methods': 'warn',
      'unicorn/no-empty-file': 'warn',
      'unicorn/no-invalid-fetch-options': 'warn',
      'unicorn/no-invalid-remove-event-listener': 'warn',
      'unicorn/no-new-array': 'warn',
      'unicorn/no-single-promise-in-promise-methods': 'warn',
      'unicorn/no-thenable': 'warn',
      'unicorn/no-unnecessary-await': 'warn',
      'unicorn/no-useless-fallback-in-spread': 'warn',
      'unicorn/no-useless-length-check': 'warn',
      'unicorn/no-useless-spread': 'warn',
      'unicorn/prefer-set-size': 'warn',
      'unicorn/prefer-string-starts-ends-with': 'warn',
      'vite-plus/prefer-vite-plus-imports': 'error',
      'typescript/switch-exhaustiveness-check': 'error',
      'typescript/consistent-type-imports': 'error',
      'unicorn/switch-case-braces': 'error',
      'default-case-last': 'allow',
      'no-return-assign': 'error',
      'no-implicit-coercion': 'error',
      'prefer-template': 'error',
      'prefer-const': 'error',
      'no-sequences': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      curly: 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'max-depth': ['warn', { max: 4 }],
      complexity: ['warn', { max: 12 }],
      'unicorn/max-nested-calls': ['warn', { max: 3 }],
      'stylistic/lines-between-class-members': [
        'error',
        {
          enforce: [
            { blankLine: 'always', prev: '*', next: 'method' },
            { blankLine: 'always', prev: 'method', next: '*' },
          ],
        },
      ],
      'stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'export',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'block-like',
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['multiline-const', 'multiline-let', 'multiline-var'],
        },

        {
          blankLine: 'always',
          prev: ['multiline-const', 'multiline-let', 'multiline-var'],
          next: '*',
        },
      ],
    },
    options: { typeAware: true, typeCheck: true },
  },
});
