import nock from 'nock'

import { downcaseKeys } from '../downcaseKeys'
import { mmtQuery } from '../mmtQuery'

describe('mmtQuery', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries mmt', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example/)
      .get(/collection_drafts/)
      .reply(200, {
        ShortName: 'Mock ShortName'
      })

    const response = await mmtQuery({
      conceptType: 'collectionDraft',
      params: {
        id: 123
      },
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
      ShortName: 'Mock ShortName'
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: collectionDraft] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries mmt using the Authorization header', async () => {
      nock(/example/, {
        reqheaders: {
          Authorization: 'test-token',
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/collection_drafts/)
        .reply(200, {
          ShortName: 'Mock ShortName'
        })

      const response = await mmtQuery({
        conceptType: 'collectionDraft',
        params: {},
        headers: {
          Authorization: 'test-token',
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      })

      const { data } = response
      expect(data).toEqual({
        ShortName: 'Mock ShortName'
      })
    })
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/example/)
        .get(/collection_drafts/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = mmtQuery({
        conceptType: 'collectionDraft',
        params: {},
        headers: {
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      })

      await expect(response).rejects.toThrow()
    })
  })
})
