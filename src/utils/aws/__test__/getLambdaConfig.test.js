import { getLambdaConfig } from '../getLambdaConfig'

describe('Test getLambdaConfig', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('when offline endpoint is configured', () => {
    process.env.AWS_SAM_LOCAL = 'true'

    const lambdaConfig = getLambdaConfig()
    expect(lambdaConfig.endpoint).toEqual('http://localhost:3014')
    process.env = OLD_ENV
  })

  test('when online endpoint is configured', () => {
    process.env.AWS_SAM_LOCAL = 'false'

    const lambdaConfig = getLambdaConfig()
    expect(lambdaConfig.endpoint).toEqual(undefined)
    process.env = OLD_ENV
  })
})
