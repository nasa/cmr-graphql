import nock from 'nock'

import maxItemsPerOrderDatasource from '../maxItemsPerOrder'

describe('maxItemsPerOrder', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns the maxItemsPerOrder of the service', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .post(/ordering\/api/)
      .reply(200, {
        data: {
          maxItemsPerOrder: 2000
        }
      })

    const response = await maxItemsPerOrderDatasource({
      providerId: 'mockProvider'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'X-Request-Id': 'abcd-1234-efgh-5678'
      }
    })

    expect(response).toEqual(2000)
  })

  test('returns null if maxItemsPerOrder of the service is null', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .post(/ordering\/api/)
      .reply(200, {
        data: {
          maxItemsPerOrder: null
        }
      })

    const response = await maxItemsPerOrderDatasource({
      providerId: 'mockProvider'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'X-Request-Id': 'abcd-1234-efgh-5678'
      }
    })

    expect(response).toEqual(null)
  })

  test('Catches errors received from cmrOrdering', async () => {
    nock(/example/)
      .post(/ordering\/api/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      maxItemsPerOrderDatasource({
        providerId: 'mockProvider'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
    ).rejects.toThrow(Error)
  })

  test('Catches graphql errors received from cmrOrdering', async () => {
    nock(/example/)
      .post(/ordering\/api/)
      .reply(200, {
        errors: ['graphql error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      maxItemsPerOrderDatasource({
        providerId: 'mockProvider'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
    ).rejects.toThrow(Error)
  })
})
