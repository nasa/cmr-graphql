// Disabling this because ESLint is having problems resolving this file,
// as long as vitest runs this isn't a real issue
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config'
import graphql from '@rollup/plugin-graphql'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: 'test-env.js',
    coverage: {
      enabled: true,
      exclude: [
        'cdk',
        '**/handler.js',
        'tmp',
        'bin',
        '*magidoc*'
      ],
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'clover', 'json'],
      reportOnFailure: true
    }
  },
  resolve: { alias: { graphql: 'graphql/index.js' } },
  plugins: [graphql()]
})
