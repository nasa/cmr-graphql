import collectionDatasource from '../collection'

import * as collectionParser from '../../parsers/collection'
import * as queryCmrCollections from '../../utils/queryCmrCollections'

describe('collection', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()
  })

  describe('without params', () => {
    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }))

      const collectionParserMock = jest.spyOn(collectionParser, 'default')

      const response = await collectionDatasource({}, {})

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith({}, {})

      expect(collectionParserMock).toBeCalledTimes(1)
      expect(collectionParserMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        id: 'C100000-EDSC'
      }])
    })
  })

  describe('with params', () => {
    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => Promise.resolve({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }))

      const collectionParserMock = jest.spyOn(collectionParser, 'default')

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, {})

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith({ concept_id: 'C100000-EDSC' }, {})

      expect(collectionParserMock).toBeCalledTimes(1)
      expect(collectionParserMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        id: 'C100000-EDSC'
      }])
    })
  })

  test('catches errors received from queryCmrCollections', async () => {
    const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => {
      throw new Error('HTTP Error')
    })

    const collectionParserMock = jest.spyOn(collectionParser, 'default')

    const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, {})

    expect(queryCmrCollectionsMock).toBeCalledTimes(1)
    expect(queryCmrCollectionsMock).toBeCalledWith({ concept_id: 'C100000-EDSC' }, {})

    expect(collectionParserMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
