module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'handler.js',
    'package-lock.json',
    'package.json',
    'types'
  ],
  setupFiles: [
    '<rootDir>/test-env.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  modulePathIgnorePatterns: [
    '.*__mocks__.*',
    'dist'
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
  },
  testPathIgnorePatterns: [
    'mocks.js'
  ],
  transformIgnorePatterns: ['node_modules/(?!axios)']
}
