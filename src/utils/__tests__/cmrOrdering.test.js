import nock from 'nock'

import { cmrOrdering } from '../cmrOrdering'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrOrdering', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr-ordering', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

    nock(/example-cmr/, {
      reqheaders: {
        'Client-Id': 'eed-test-graphql',
        'X-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .post(/ordering\/api/)
      .reply(200, {
        data: {
          maxItemsPerOrder: 2000
        }
      })

    const query = `query Query($providerId: String!) {
      maxItemsPerOrder(providerId: $providerId)
    }`

    const variables = {
      providerId: 'mockProvider'
    }

    const response = await cmrOrdering({
      query,
      variables,
      headers: {
        'Client-Id': 'eed-test-graphql',
        'X-Request-Id': 'abcd-1234-efgh-5678'
      }
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)

    expect(data).toEqual({
      data: {
        maxItemsPerOrder: 2000
      }
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 from eed-test-graphql to [cmrOrdering] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example-cmr/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .post(/ordering\/api/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrOrdering({
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
