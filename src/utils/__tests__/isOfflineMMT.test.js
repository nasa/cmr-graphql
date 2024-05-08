import { isOfflineMMT } from '../isOfflineMMT'

describe('isOfflineMMT', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      ursRootUrl: 'https://example-urs.com'
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when running offline with the local MMT token', () => {
    test('returns true', async () => {
      process.env.IS_OFFLINE = true
      const token = await isOfflineMMT('ABC-1')

      expect(token).toEqual(true)
    })
  })

  describe('when running online with the local MMT token', () => {
    test('returns false', async () => {
      process.env.IS_OFFLINE = false
      const token = await isOfflineMMT('ABC-1')

      expect(token).toEqual(false)
    })
  })

  describe('when running online a regular token', () => {
    test('returns false', async () => {
      process.env.IS_OFFLINE = false
      const token = await isOfflineMMT('mock-token')

      expect(token).toEqual(false)
    })
  })
})
