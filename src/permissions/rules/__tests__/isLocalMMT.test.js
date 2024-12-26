import { isLocalMMT } from '../isLocalMMT'

describe('isLocalMMT', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns true if the request is offline and has the admin token', async () => {
    process.env.AWS_SAM_LOCAL = 'true'

    const result = await isLocalMMT.resolve(
      null,
      {},
      {
        headers: {
          Authorization: 'ABC-1'
        }
      }
    )

    expect(result).toEqual(true)
  })

  test('returns false if the request is offline but a real token is passed', async () => {
    process.env.AWS_SAM_LOCAL = 'true'

    const result = await isLocalMMT.resolve(
      null,
      {},
      {
        headers: {
          Authorization: 'mock-token'
        }
      }
    )

    expect(result).toEqual(false)
  })

  test('returns false if the request is not offline', async () => {
    process.env.AWS_SAM_LOCAL = 'false'

    const result = await isLocalMMT.resolve(
      null,
      {},
      {
        headers: {
          Authorization: 'mock-token'
        }
      }
    )

    expect(result).toEqual(false)
  })
})
