import granuleDatasource from '../granule'

import * as granuleParser from '../../utils/parseCmrGranules'
import * as queryCmrGranules from '../../utils/queryCmrGranules'

describe('granule', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()
  })

  describe('without params', () => {
    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }))

      const granuleParserMock = jest.spyOn(granuleParser, 'parseCmrGranules')

      const response = await granuleDatasource({}, {})

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith({}, {})

      expect(granuleParserMock).toBeCalledTimes(1)
      expect(granuleParserMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        id: 'G100000-EDSC'
      }])
    })
  })

  describe('with params', () => {
    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }))

      const granuleParserMock = jest.spyOn(granuleParser, 'parseCmrGranules')

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, {})

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith({ concept_id: 'G100000-EDSC' }, {})

      expect(granuleParserMock).toBeCalledTimes(1)
      expect(granuleParserMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        id: 'G100000-EDSC'
      }])
    })
  })

  test('catches errors received from queryCmrGranules', async () => {
    const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => {
      throw new Error('HTTP Error')
    })

    const granuleParserMock = jest.spyOn(granuleParser, 'parseCmrGranules')

    const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, {})

    expect(queryCmrGranulesMock).toBeCalledTimes(1)
    expect(queryCmrGranulesMock).toBeCalledWith({ concept_id: 'G100000-EDSC' }, {})

    expect(granuleParserMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
