import nock from 'nock'

import { describe } from 'vitest'
import { cmrQuery } from '../cmrQuery'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrQuery', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr using a GET', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

    nock(/example-cmr/, {
      reqheaders: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .defaultReplyHeaders({
        'CMR-Took': 7
      })
      .get(/collections\.json/)
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

  describe('when the request parameters result in a url longer than the defined threshold', () => {
    test('queries cmr using a POST request', async () => {
      process.env.maximumQueryPathLength = 50

      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-cmr/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .defaultReplyHeaders({
          'CMR-Took': 7
        })
        .post('/search/collections.json?')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      const response = await cmrQuery({
        conceptType: 'collections',
        params: {
          polygon: '-83.10938,41.98153,-82.72266,42.57944,-82.37109,43.03666,-82.58203,43.81043,-83.25,43.98629,-83.28516,44.65454,-83.28516,45.21728,-84.51563,45.60416,-84.05859,46.06139,-85.11328,46.79998,-86.625,46.58895,-87.15234,46.51861,-87.99609,46.90549,-88.41797,46.90549,-87.60938,47.50341,-90.17578,46.72964,-88.41797,45.95587,-87.71484,45.6745,-88.03125,45.25245,-87.39844,45.18211,-85.5,46.06139,-84.83203,46.06139,-84.9375,45.4283,-85.46484,44.72488,-85.60547,45.25245,-86.23828,44.65454,-86.55469,43.8456,-86.23828,42.96632,-86.34375,42.19255,-86.87109,41.94636,-83.10938,41.98153'
        },
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
  })

  describe('when provided a format', () => {
    test('queries cmr', async () => {
      nock(/example-cmr/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/collections\.umm_json/)
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
      nock(/example-cmr/, {
        reqheaders: {
          Authorization: 'Bearer test-token',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/collections\.json/)
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
      nock(/example-cmr/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/collections\.json/)
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
