module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'package.json',
    'package-lock.json'
  ],
  setupFiles: [
    '<rootDir>/test-env.js'
  ]
}
