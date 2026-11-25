import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/domaine/**/*.test.ts'],
    environment: 'node',
  },
});
