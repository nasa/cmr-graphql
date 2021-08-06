import nock from 'nock'

import { cmrGraphDb } from '../cmrGraphDb'

describe('cmrGraphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr graphdb', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example/, {
      reqheaders: {
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .post(/graphdb/)
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
    } = headers

    expect(data).toEqual({
      mock: 'result'
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 to [graphdb conceptId: C100000-EDSC] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example/, {
        reqheaders: {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/graphdb/)
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
