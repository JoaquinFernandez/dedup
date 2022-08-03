export default {
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
