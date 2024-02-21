import nock from 'nock'

import { aclQuery } from '../aclQuery'
import { downcaseKeys } from '../downcaseKeys'

describe('aclQuery', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example-cmr/, {
      reqheaders: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .defaultReplyHeaders({
        'CMR-Took': 7
      })
      .get(/acls/)
      .reply(200, {
        items: [
          {
            acl: {
              provider_identity: {
                provider_id: 'example-provider-id'
              }
            }
          }
        ]
      })

    const response = await aclQuery({
      conceptType: 'Mock  conceptType',
      params: {},
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration,
      'cmr-took': cmrTook
    } = downcaseKeys(headers)

    expect(data).toEqual({
      items: [
        {
          acl: {
            provider_identity: {
              provider_id: 'example-provider-id'
            }
          }
        }
      ]
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 from eed-test-graphql to [format: json] completed external request in [reported: ${cmrTook} ms, observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a format', () => {
    test('queries acl', async () => {
      nock(/example-cmr/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/acl/)
        .reply(200, {
          items: [
            {
              acl: {
                provider_identity: {
                  provider_id: 'example-provider-id'
                }
              }
            }
          ]
        })

      const response = await aclQuery({
        conceptType: 'collections',
        params: {},
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        options: { format: 'umm_json' }
      })

      const { data } = response
      expect(data).toEqual({
        items: [
          {
            acl: {
              provider_identity: {
                provider_id: 'example-provider-id'
              }
            }
          }
        ]
      })
    })
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries cmr using the Authorization header', async () => {
      nock(/example-cmr/, {
        reqheaders: {
          Authorization: 'ABC-1',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/acls/)
        .reply(200, {
          items: [
            {
              acl: {
                provider_identity: {
                  provider_id: 'example-provider-id'
                }
              }
            }
          ]
        })

      const response = await aclQuery({
        conceptType: 'Mock conceptType',
        params: {},
        headers: {
          Authorization: 'ABC-1',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })

      const { data } = response
      expect(data).toEqual({
        items: [
          {
            acl: {
              provider_identity: {
                provider_id: 'example-provider-id'
              }
            }
          }
        ]
      })
    })
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example-cmr/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/acls/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = aclQuery({
        conceptType: 'Mock conceptType',
        params: {},
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })

      await expect(response).rejects.toThrow()
    })
  })
})
