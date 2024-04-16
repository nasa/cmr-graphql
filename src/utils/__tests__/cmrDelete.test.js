import nock from 'nock'

import { cmrDelete } from '../cmrDelete'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrDelete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('deletes a record from cmr', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

    nock(/example-cmr/, {
      reqheaders: {
        Accept: 'application/json',
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .delete(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
      .reply(201, {
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

    const response = await cmrDelete({
      conceptType: 'subscriptions',
      data: {
        conceptId: 'SUB100000-EDSC',
        nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        providerId: 'MMT1'
      },
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      },
      options: {
        path: 'ingest/subscriptions/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
      }
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)

    expect(data).toEqual({
      'concept-id': 'SUB100000-EDSC',
      'revision-id': 1
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 from eed-test-graphql to delete [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries cmr using the Authorization header', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-cmr/, {
        reqheaders: {
          Accept: 'application/json',
          Authorization: 'Bearer test-token',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .delete(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrDelete({
        conceptType: 'subscriptions',
        data: {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
          providerId: 'MMT1'
        },
        headers: {
          Authorization: 'Bearer test-token',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        options: {
          path: 'ingest/subscriptions/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        }
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 from eed-test-graphql to delete [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
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
        .delete(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrDelete({
        conceptType: 'subscriptions',
        data: {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
          providerId: 'MMT1'
        },
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        options: {
          path: 'ingest/subscriptions/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        }
      })

      await expect(response).rejects.toThrow()
    })
  })
})
