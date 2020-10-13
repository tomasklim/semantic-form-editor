module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  setupFiles: ['<rootDir>/config/setup.js'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](build|docs|node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@pages/(.*)': '<rootDir>/src/pages/$1',
    '^@components/(.*)': '<rootDir>/src/components/$1',
    '^@contexts/(.*)': '<rootDir>/src/contexts/$1',
    '^@constants/(.*)': '<rootDir>/src/constants/$1',
    '^@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '^@model/(.*)': '<rootDir>/src/model/$1',
    '^@styles/(.*)': '<rootDir>/src/styles/$1',
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@data/(.*)': '<rootDir>/src/data/$1'
  },
  testRegex: '/__tests__/.*\\.(test|spec)\\.tsx?$'
};
