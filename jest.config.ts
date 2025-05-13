import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        target: 'es2021',
        transform: {
          react: {
            runtime: 'automatic'
          }
        }
      },
      module: {
        type: 'commonjs'
      }
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(unified|unist-util-*|mdast-*|micromark-*|remark-*|rehype-*|hast-*|property-information|space-separated-tokens|comma-separated-tokens|html-void-elements|web-namespaces|zwitch|bail|trough|vfile|vfile-*|ccount|escape-string-regexp|markdown-table|longest-streak|is-plain-obj)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig); 