import { queryCmrGranules } from '../queryCmrGranules'

import * as queryCmr from '../queryCmr'

describe('queryCmr', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr for granules', async () => {
    const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => Promise.resolve({
      data: {
        feed: {
          entry: [{
            id: 'G100000-EDSC'
          }]
        }
      }
    }))

    const response = await queryCmrGranules(
      {},
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
    )

    expect(queryCmrMock).toBeCalledTimes(1)
    expect(queryCmrMock).toBeCalledWith(
      'granules',
      {},
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
    )

    const { data } = response
    expect(data).toEqual({
      feed: {
        entry: [{
          id: 'G100000-EDSC'
        }]
      }
    })
  })

  describe('with params', () => {
    test('allows permitted params', async () => {
      const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }))

      const response = await queryCmrGranules(
        { collection_concept_id: 'G100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
      )

      expect(queryCmrMock).toBeCalledTimes(1)
      expect(queryCmrMock).toBeCalledWith(
        'granules',
        { collection_concept_id: 'G100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
      )

      const { data } = response
      expect(data).toEqual({
        feed: {
          entry: [{
            id: 'G100000-EDSC'
          }]
        }
      })
    })

    test('removes unpermitted params', async () => {
      const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }))

      const response = await queryCmrGranules(
        { random_param: 'value' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
      )

      expect(queryCmrMock).toBeCalledTimes(1)
      expect(queryCmrMock).toBeCalledWith(
        'granules',
        {},
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
      )

      const { data } = response
      expect(data).toEqual({
        feed: {
          entry: [{
            id: 'G100000-EDSC'
          }]
        }
      })
    })
  })

  test('throws errors received from queryCmr', async () => {
    const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => {
      throw new Error('HTTP Error')
    })

    const response = queryCmrGranules(
      {},
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
    )

    expect(queryCmrMock).toBeCalledTimes(1)
    expect(queryCmrMock).toBeCalledWith(
      'granules',
      {},
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
    )

    await expect(response).rejects.toThrow()
  })
})
