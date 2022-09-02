import nock from 'nock'

import { cmrGraphDb } from '../cmrGraphDb'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrGraphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.graphdbHost = 'http://example.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when a graphdbPath is not used', () => {
    beforeEach(() => {
      process.env.graphdbPath = ''
    })

    test('queries cmr graphdb', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(() => true)
        .reply(200, {
          mock: 'result'
        })

      const response = await cmrGraphDb({
        conceptId: 'C100000-EDSC',
        headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        query: 'mock query'
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        mock: 'result'
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to [graphdb conceptId: C100000-EDSC] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when a graphdbPath is used', () => {
    beforeEach(() => {
      process.env.graphdbPath = 'gremlin'
    })

    test('queries cmr graphdb', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/gremlin/)
        .reply(200, {
          mock: 'result'
        })

      const response = await cmrGraphDb({
        conceptId: 'C100000-EDSC',
        headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        query: 'mock query'
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        mock: 'result'
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to [graphdb conceptId: C100000-EDSC] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(() => true)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrGraphDb({
        conceptId: 'C100000-EDSC',
        headers: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        query: 'mock query'
      })

      await expect(response).rejects.toThrow()
    })
  })
})
