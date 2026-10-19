import { defineConfig } from 'vite-plus';

import { courseCatalog } from './scripts/course-catalog';

// 单元测试不加载应用的 Nitro、Vue DevTools 等服务插件。
export default defineConfig({
  plugins: [courseCatalog()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
