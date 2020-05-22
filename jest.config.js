module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'package.json',
    'package-lock.json',
    'types'
  ],
  setupFiles: [
    '<rootDir>/test-env.js'
  ],

  // https://github.com/axios/axios/issues/1180#issuecomment-375093333
  // By default jest runs tests in jsdom mode which adds XmlHttpRequest
  // to global scope which in turns causes axios to think it's running
  // in a browser and making requests via XmlHttpRequest instead of
  // node's native library.
  testEnvironment: 'node',
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.(js)$': 'babel-jest'
  }
}
