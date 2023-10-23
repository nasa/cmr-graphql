import nock from 'nock'

import { cmrQuery } from '../cmrQuery'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrQuery', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example/, {
      reqheaders: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .defaultReplyHeaders({
        'CMR-Took': 7
      })
      .post(/collections\.json/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'C100000-EDSC'
          }]
        }
      })

    const response = await cmrQuery({
      conceptType: 'collections',
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
      feed: {
        entry: [{
          id: 'C100000-EDSC'
        }]
      }
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: collections, format: json] completed external request in [reported: ${cmrTook} ms, observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a format', () => {
    test('queries cmr', async () => {
      nock(/example/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/collections\.umm_json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      const response = await cmrQuery({
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
        feed: {
          entry: [{
            id: 'C100000-EDSC'
          }]
        }
      })
    })
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries cmr using the Authorization header', async () => {
      nock(/example/, {
        reqheaders: {
          Authorization: 'Bearer test-token',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      const response = await cmrQuery({
        conceptType: 'collections',
        params: {},
        headers: {
          Authorization: 'Bearer test-token',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })

      const { data } = response
      expect(data).toEqual({
        feed: {
          entry: [{
            id: 'C100000-EDSC'
          }]
        }
      })
    })
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/collections\.json/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrQuery({
        conceptType: 'collections',
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
