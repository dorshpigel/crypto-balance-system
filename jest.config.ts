export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/rate-service$': '<rootDir>/apps/rate-service/src/rate-service.service.ts',
    '^@app/shared/(.*)$': '<rootDir>/libs/shared/src/$1',
    '^@app/shared$': '<rootDir>/libs/shared/src/index.ts',
  },
};
