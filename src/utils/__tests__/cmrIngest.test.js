import nock from 'nock'

jest.mock('uuid', () => ({ v4: () => '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' }))

import { cmrIngest } from '../cmrIngest'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrIngest', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('ingests a record into cmr', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example/, {
      reqheaders: {
        Accept: 'application/json',
        'Content-Type': 'application/vnd.nasa.cmr.umm+json; version=1.0',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .put(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
      .reply(201, {
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

    const response = await cmrIngest(
      'subscriptions',
      { collectionConceptId: 'C100000-EDSC' },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      '1.0'
    )

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)

    expect(data).toEqual({
      'concept-id': 'SUB100000-EDSC',
      'revision-id': 1
    })

    expect(consoleMock).toBeCalledWith(
      `Request abcd-1234-efgh-5678 to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
    )
  })

  describe('when provided a native id', () => {
    test('ingests a record into cmr with the provided native id', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .put(/ingest\/providers\/EDSC\/subscriptions\/provided-native-id/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrIngest(
        'subscriptions',
        {
          collectionConceptId: 'C100000-EDSC',
          nativeId: 'provided-native-id'
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Echo-Token header', () => {
    test('queries cmr using the Echo-Token header', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'Echo-Token': 'test-token'
        }
      })
        .put(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrIngest(
        'subscriptions',
        { collectionConceptId: 'C100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678', 'Echo-Token': 'test-token' }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Authorization header', () => {
    test('queries cmr using the Authorization header', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
        }
      })
        .put(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrIngest(
        'subscriptions',
        { collectionConceptId: 'C100000-EDSC' },
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
        }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when provided a token via the Authorization header and the Echo-Token header', () => {
    test('queries cmr using the Authorization header', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock(/example/, {
        reqheaders: {
          Accept: 'application/json',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'authorization-token'
        }
      })
        .put(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrIngest(
        'subscriptions',
        { collectionConceptId: 'C100000-EDSC' },
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'authorization-token',
          'Echo-Token': 'echo-token'
        }
      )

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 to ingest [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
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
        .put(/ingest\/providers\/EDSC\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrIngest(
        'subscriptions',
        { collectionConceptId: 'C100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )

      await expect(response).rejects.toThrow()
    })
  })
})
