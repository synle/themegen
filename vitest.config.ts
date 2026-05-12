import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/types.ts',
        '**/__tests__/**',
        'src/index.ts',
        'dist/**',
        'node_modules/**',
      ],
      // raise as coverage improves; never lower
      thresholds: {
        lines: 17,
        branches: 90,
        functions: 72,
        statements: 17,
      },
    },
  },
});
