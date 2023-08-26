/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
    "^~tests/(.*)$": "<rootDir>/tests/$1",
  },
  clearMocks: true,
  testEnvironment: "node",
}
