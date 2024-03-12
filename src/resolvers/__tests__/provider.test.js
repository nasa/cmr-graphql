import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Provider', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all provider fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/providers/)
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

      const response = await server.executeOperation({
        variables: {},
        query: `{
          providers {
            count
            items {
              providerId
              shortName
              cmrOnly
              small
              consortiums
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        providers: {
          count: 3,
          items: [
            {
              providerId: 'ESA',
              shortName: 'ESA',
              cmrOnly: false,
              small: false,
              consortiums: 'CEOS FEDEO'
            },
            {
              providerId: 'GHRC',
              shortName: 'GHRC',
              cmrOnly: false,
              small: false,
              consortiums: 'EOSDIS GEOSS'
            },
            {
              providerId: 'ECHO',
              shortName: 'ECHO',
              cmrOnly: false,
              small: true,
              consortiums: null
            }
          ]
        }
      })
    })
  })
})
