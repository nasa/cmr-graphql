import nock from 'nock'

vi.mock('uuid', () => ({ v4: () => '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' }))

import { cmrIngest } from '../cmrIngest'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrIngest', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('ingests a record into cmr', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

    nock(/example-cmr/, {
      reqheaders: {
        Accept: 'application/json',
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'Content-Type': 'application/vnd.nasa.cmr.umm+json; version=1.0'
      }
    })
      .put(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
      .reply(201, {
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

    const response = await cmrIngest({
      conceptType: 'subscriptions',
      data: {
        collectionConceptId: 'C100000-EDSC',
        providerId: 'EDSC'
      },
      headers: {
        'CMR-Request-Id': 'abcd-1234-efgh-5678',
        'Client-Id': 'eed-test-graphql',
        'Content-Type': 'application/vnd.nasa.cmr.umm+json; version=1.0'
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
      `Request abcd-1234-efgh-5678 from eed-test-graphql to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a native id', () => {
    test('ingests a record into cmr with the provided native id', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-cmr/, {
        reqheaders: {
          Accept: 'application/json',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .put(/ingest\/subscriptions\/provided-native-id/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrIngest({
        conceptType: 'subscriptions',
        data: {
          collectionConceptId: 'C100000-EDSC',
          nativeId: 'provided-native-id'
        },
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        options: {
          path: 'ingest/subscriptions/provided-native-id'
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
        `Request abcd-1234-efgh-5678 from eed-test-graphql to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries cmr using the Authorization header', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-cmr/, {
        reqheaders: {
          Accept: 'application/json',
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'Bearer test-token'
        }
      })
        .put(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrIngest({
        conceptType: 'subscriptions',
        data: {
          collectionConceptId: 'C100000-EDSC'
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
        `Request abcd-1234-efgh-5678 from eed-test-graphql to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
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
        .put(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrIngest({
        conceptType: 'subscriptions',
        data: {
          collectionConceptId: 'C100000-EDSC'
        },
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })

      await expect(response).rejects.toThrow()
    })
  })
})
