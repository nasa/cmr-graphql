import { queryCmrUmmConcept } from '../queryCmrUmmConcept'

import * as queryCmr from '../queryCmr'

beforeEach(() => {
  jest.resetAllMocks()
})

describe('queryCmrUmmConcept', () => {
  describe('when only a json key is requested', () => {
    test('only makes a request to the json endpoint', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementationOnce(() => jest.fn())
      const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }))

      const response = await queryCmrUmmConcept(
        'collections',
        { concept_id: 'C100000-EDSC' },
        {
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        },
        {
          jsonKeys: ['concept_id'],
          ummKeys: [],
          keyMappings: {
            type: 'umm.Type'
          }
        }
      )

      expect(queryCmrMock).toBeCalledTimes(1)
      expect(queryCmrMock).toBeCalledWith(
        'collections',
        { concept_id: 'C100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
      )

      const [jsonResponse] = response
      const { data } = await jsonResponse

      expect(data).toEqual({
        feed: {
          entry: [{
            id: 'C100000-EDSC'
          }]
        }
      })

      expect(consoleMock).toBeCalledTimes(1)
      expect(consoleMock).toBeCalledWith('Request abcd-1234-efgh-5678 requested [format: json, key: concept_id]')
    })
  })

  describe('when only a umm key is requested', () => {
    test('only makes a request to the json endpoint', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementationOnce(() => jest.fn())
      const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => Promise.resolve({
        data: {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Type: 'OPeNDAP'
            }
          }]
        }
      }))

      const response = await queryCmrUmmConcept(
        'collections',
        { concept_id: 'C100000-EDSC' },
        {
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        },
        {
          jsonKeys: [],
          ummKeys: ['Type'],
          keyMappings: {
            type: 'umm.Type'
          }
        }
      )

      expect(queryCmrMock).toBeCalledTimes(1)
      expect(queryCmrMock).toBeCalledWith(
        'collections',
        { concept_id: 'C100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        { format: 'umm_json' }
      )

      const [, ummResponse] = response
      const { data } = await ummResponse

      expect(data).toEqual({
        items: [{
          meta: {
            'concept-id': 'C100000-EDSC'
          },
          umm: {
            Type: 'OPeNDAP'
          }
        }]
      })
      expect(consoleMock).toBeCalledTimes(1)
      expect(consoleMock).toBeCalledWith('Request abcd-1234-efgh-5678 requested [format: umm, key: Type]')
    })
  })

  describe('when both a json key and a umm key is requested', () => {
    test('only makes a request to the json endpoint', async () => {
      const consoleMock = jest.spyOn(console, 'log').mockImplementationOnce(() => jest.fn())
      const queryCmrMock = jest.spyOn(queryCmr, 'queryCmr').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }))
        .mockImplementationOnce(() => Promise.resolve({
          data: {
            items: [{
              meta: {
                'concept-id': 'C100000-EDSC'
              },
              umm: {
                Type: 'OPeNDAP'
              }
            }]
          }
        }))

      const response = await queryCmrUmmConcept(
        'collections',
        { concept_id: 'C100000-EDSC' },
        {
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        },
        {
          jsonKeys: ['concept_id'],
          ummKeys: ['Type'],
          keyMappings: {
            type: 'umm.Type'
          }
        }
      )

      expect(queryCmrMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = queryCmrMock.mock.calls
      expect(jsonCall[0]).toEqual(
        'collections',
        { concept_id: 'C100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }
      )

      expect(ummCall[0]).toEqual(
        'collections',
        { concept_id: 'C100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        { format: 'umm_json' }
      )

      const [jsonResponse, ummResponse] = response
      const { data: jsonData } = await jsonResponse

      expect(jsonData).toEqual({
        feed: {
          entry: [{
            id: 'C100000-EDSC'
          }]
        }
      })

      const { data: ummData } = await ummResponse

      expect(ummData).toEqual({
        items: [{
          meta: {
            'concept-id': 'C100000-EDSC'
          },
          umm: {
            Type: 'OPeNDAP'
          }
        }]
      })

      const { mock } = consoleMock
      const { calls } = mock
      const [jsonLog, ummLog] = calls

      expect(consoleMock).toBeCalledTimes(2)
      expect(jsonLog).toEqual(['Request abcd-1234-efgh-5678 requested [format: json, key: concept_id]'])
      expect(ummLog).toEqual(['Request abcd-1234-efgh-5678 requested [format: umm, key: Type]'])
    })
  })
})
