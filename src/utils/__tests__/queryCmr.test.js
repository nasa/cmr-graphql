import nock from 'nock'

import { queryCmr } from '../queryCmr'

describe('queryCmr', () => {
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

    const response = await queryCmr(
      'collections',
      {},
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
    )

    const { data, headers } = response

    const {
      'request-duration': requestDuration,
      'cmr-took': cmrTook
    } = headers

    expect(data).toEqual({
      feed: {
        entry: [{
          id: 'C100000-EDSC'
        }]
      }
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 to [concept: collections, format: json] completed external request in [reported: ${cmrTook} ms, observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a format', () => {
    test('queries cmr', async () => {
      nock(/example/, {
        reqheaders: {
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

      const response = await queryCmr(
        'collections',
        {},
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        { format: 'umm_json' }
      )

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

  describe('when provided a token via the Echo-Token header', () => {
    test('queries cmr using the Echo-Token header', async () => {
      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'Echo-Token': 'test-token'
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

      const response = await queryCmr(
        'collections',
        {},
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'Echo-Token': 'test-token'
        }
      )

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
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
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

      const response = await queryCmr(
        'collections',
        {},
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
        }
      )

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

  describe('when provided a token via the Authorization header and the Echo-Token header', () => {
    test('queries cmr using the Authorization header', async () => {
      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'authorization-token'
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

      const response = await queryCmr(
        'collections',
        {},
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'authorization-token',
          'Echo-Token': 'echo-token'
        }
      )

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
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/collections\.json/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = queryCmr(
        'collections',
        {},
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      )

      await expect(response).rejects.toThrow()
    })
  })
})
