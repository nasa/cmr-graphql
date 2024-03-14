import nock from 'nock'

import providerDatasource from '../provider'

let requestInfo

describe('provider', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'providers',
      alias: 'providers',
      args: {},
      fieldsByTypeName: {
        ProviderList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Provider: {
                conceptId: {
                  name: 'providerId',
                  alias: 'providerId',
                  args: {},
                  fieldsByTypeName: {}
                }
              }
            }
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('without params', () => {
    test('returns the parsed provider results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/ingest\/providers/)
        .reply(200, [
          {
            'provider-id': 'ESA',
            'short-name': 'ESA',
            'cmr-only': false,
            small: false,
            consortiums: 'CEOS FEDEO'
          },
          {
            'provider-id': 'GHRC',
            'short-name': 'GHRC',
            'cmr-only': false,
            small: false,
            consortiums: 'EOSDIS GEOSS'
          },
          {
            'provider-id': 'ECHO',
            'short-name': 'ECHO',
            'cmr-only': false,
            small: true
          }])

      const response = await providerDatasource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 3,
        cursor: null,
        items: [
          {
            providerId: 'ESA'
          },
          {
            providerId: 'GHRC'
          },
          {
            providerId: 'ECHO'
          }
        ]
      })
    })
  })

  test('Catches errors received from queryCmr', async () => {
    nock(/example-cmr/)
      .get(/providers/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      providerDatasource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
