import { queryCmrTools } from '../queryCmrTools'

import * as queryCmrUmmConcept from '../queryCmrUmmConcept'

let requestInfo

describe('queryCmrTools', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
    process.env.ummToolVersion = '0.5'

    // Default requestInfo an empty
    requestInfo = {
      jsonKeys: ['conceptId'],
      ummKeys: [],
      ummKeyMappings: {}
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries cmr for tools', async () => {
    const queryCmrUmmConceptMock = jest.spyOn(queryCmrUmmConcept, 'queryCmrUmmConcept').mockImplementationOnce(() => [
      Promise.resolve({
        data: {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        }
      })
    ])

    const response = await queryCmrTools(
      {},
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      requestInfo
    )

    expect(queryCmrUmmConceptMock).toBeCalledTimes(1)
    expect(queryCmrUmmConceptMock).toBeCalledWith(
      'tools',
      {},
      {
        Accept: 'application/vnd.nasa.cmr.umm_results+json; version=0.5',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      },
      requestInfo
    )

    const [jsonResponse] = response
    const { data } = await jsonResponse

    expect(data).toEqual({
      items: [{
        concept_id: 'T100000-EDSC'
      }]
    })
  })

  describe('with params', () => {
    test('allows permitted params', async () => {
      const queryCmrUmmConceptMock = jest.spyOn(queryCmrUmmConcept, 'queryCmrUmmConcept').mockImplementationOnce(() => [
        Promise.resolve({
          data: {
            items: [{
              concept_id: 'T100000-EDSC'
            }]
          }
        })
      ])

      const response = await queryCmrTools(
        { concept_id: 'T100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        requestInfo
      )

      expect(queryCmrUmmConceptMock).toBeCalledTimes(1)
      expect(queryCmrUmmConceptMock).toBeCalledWith(
        'tools',
        { concept_id: 'T100000-EDSC' },
        {
          Accept: 'application/vnd.nasa.cmr.umm_results+json; version=0.5',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        requestInfo
      )

      const [jsonResponse] = response
      const { data } = await jsonResponse

      expect(data).toEqual({
        items: [{
          concept_id: 'T100000-EDSC'
        }]
      })
    })

    test('removes unpermitted params', async () => {
      const queryCmrUmmConceptMock = jest.spyOn(queryCmrUmmConcept, 'queryCmrUmmConcept').mockImplementationOnce(() => [
        Promise.resolve({
          data: {
            items: [{
              concept_id: 'T100000-EDSC'
            }]
          }
        })
      ])

      const response = await queryCmrTools(
        { random_param: 'value' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        requestInfo
      )

      expect(queryCmrUmmConceptMock).toBeCalledTimes(1)
      expect(queryCmrUmmConceptMock).toBeCalledWith(
        'tools',
        {},
        {
          Accept: 'application/vnd.nasa.cmr.umm_results+json; version=0.5',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        requestInfo
      )

      const [jsonResponse] = response
      const { data } = await jsonResponse

      expect(data).toEqual({
        items: [{
          concept_id: 'T100000-EDSC'
        }]
      })
    })
  })

  test('throws errors received from queryCmrUmmConcept', async () => {
    const queryCmrUmmConceptMock = jest.spyOn(queryCmrUmmConcept, 'queryCmrUmmConcept')
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error('HTTP Error'))))

    const response = queryCmrTools(
      {},
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      requestInfo
    )

    expect(queryCmrUmmConceptMock).toBeCalledTimes(1)
    expect(queryCmrUmmConceptMock).toBeCalledWith(
      'tools',
      {},
      {
        Accept: 'application/vnd.nasa.cmr.umm_results+json; version=0.5',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      },
      requestInfo
    )

    await expect(response).rejects.toThrow()
  })
})
