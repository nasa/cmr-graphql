import nock from 'nock'

import { cmrDelete } from '../cmrDelete'
import { downcaseKeys } from '../downcaseKeys'

describe('cmrDelete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('deletes a record from cmr', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/example/, {
      reqheaders: {
        Accept: 'application/json',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    })
      .delete(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
      .reply(201, {
        'concept-id': 'SUB100000-EDSC',
        'revision-id': 1
      })

    const response = await cmrDelete(
      'subscriptions',
      {
        conceptId: 'SUB100000-EDSC',
        nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
      },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      'subscriptions'
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
      `Request abcd-1234-efgh-5678 to delete [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
    )
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
        .delete(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(201, {
          'concept-id': 'SUB100000-EDSC',
          'revision-id': 1
        })

      const response = await cmrDelete(
        'subscriptions',
        {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          Authorization: 'test-token'
        },
        'subscriptions'
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
        `Request abcd-1234-efgh-5678 to delete [concept: subscriptions] completed external request in [observed: ${requestDuration} ms]`
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
        .delete(/ingest\/subscriptions\/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/)
        .reply(500, {
          errors: ['HTTP Error']
        })

      const response = cmrDelete(
        'subscriptions',
        {
          conceptId: 'SUB100000-EDSC',
          nativeId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        'subscriptions'
      )

      await expect(response).rejects.toThrow()
    })
  })
})
