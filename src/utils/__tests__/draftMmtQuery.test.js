import nock from 'nock'

import { draftMmtQuery } from '../draftMmtQuery'
import { downcaseKeys } from '../downcaseKeys'

describe('draftMmtQuery', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.draftMmtRootUrl = 'http://example-mmt.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('with a custom CA cert file', () => {
    beforeEach(() => {
      process.env.dmmtSslCert = '-----BEGIN CERTIFICATE-----\nmock-certificate\n-----END CERTIFICATE-----'
    })

    afterEach(() => {
      process.env = OLD_ENV
    })

    test('queries draft mmt', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example-mmt/)
        .get(/collection_draft_proposals/)
        .reply(200, {
          ShortName: 'Mock ShortName'
        })

      const response = await draftMmtQuery({
        conceptType: 'collectionDraftProposal',
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
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: collectionDraftProposal] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('without a custom CA cert file', () => {
    beforeEach(() => {
      process.env.dmmtSslCert = 'false'
    })

    afterEach(() => {
      process.env = OLD_ENV
    })

    test('queries draft mmt', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example-mmt/)
        .get(/collection_draft_proposals/)
        .reply(200, {
          ShortName: 'Mock ShortName'
        })

      const response = await draftMmtQuery({
        conceptType: 'collectionDraftProposal',
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
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: collectionDraftProposal] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries draft mmt using the Authorization header', async () => {
      nock(/example-mmt/, {
        reqheaders: {
          Authorization: 'Bearer test-token',
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .get(/collection_draft_proposals/)
        .reply(200, {
          ShortName: 'Mock ShortName'
        })

      const response = await draftMmtQuery({
        conceptType: 'collectionDraftProposal',
        params: {},
        headers: {
          Authorization: 'Bearer test-token',
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
      nock(/example-mmt/)
        .get(/collection_draft_proposals/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = draftMmtQuery({
        conceptType: 'collectionDraftProposal',
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
