import collectionDatasource from '../collection'

import * as parseCmrCollections from '../../utils/parseCmrCollections'
import * as queryCmrCollections from '../../utils/queryCmrCollections'

let requestInfo

describe('collection', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()

    // Default requestInfo an empty
    requestInfo = {
      name: 'collections',
      alias: 'collections',
      args: {},
      fieldsByTypeName: {
        Collection: {
          id: {
            name: 'id',
            alias: 'id',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  describe('without params', () => {
    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [{
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }])


      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({}, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        {},
        {},
        expect.objectContaining({ jsonKeys: ['id'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
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
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [{
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({ id: 'C100000-EDSC' }, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { id: 'C100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['id'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
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

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          Collection: {
            id: {
              name: 'id',
              alias: 'id',
              args: {},
              fieldsByTypeName: {}
            },
            abstract: {
              name: 'abstract',
              alias: 'abstract',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [{
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }, {
        data: {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            }
          }]
        }
      }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({ id: 'C100000-EDSC' }, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { id: 'C100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['id'], ummKeys: ['abstract'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = parseCmrCollectionsMock.mock.calls
      expect(jsonCall[0]).toEqual({
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      })
      expect(ummCall[0]).toEqual({
        data: {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            }
          }]
        }
      })

      expect(response).toEqual([{
        id: 'C100000-EDSC',
        abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
      }])
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          Collection: {
            abstract: {
              name: 'abstract',
              alias: 'abstract',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [
        null,
        {
          data: {
            items: [{
              meta: {
                'concept-id': 'C100000-EDSC'
              },
              umm: {
                Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
              }
            }]
          }
        }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({ id: 'C100000-EDSC' }, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { id: 'C100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: [], ummKeys: ['abstract'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        data: {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            }
          }]
        }
      }, 'umm_json')

      expect(response).toEqual([{
        abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
      }])
    })
  })

  test('catches errors received from queryCmrCollections', async () => {
    const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections')
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error('HTTP Error'))))

    const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

    const response = await collectionDatasource({ id: 'C100000-EDSC' }, {}, requestInfo)

    expect(queryCmrCollectionsMock).toBeCalledTimes(1)
    expect(queryCmrCollectionsMock).toBeCalledWith(
      { id: 'C100000-EDSC' },
      {},
      expect.objectContaining({ jsonKeys: ['id'] })
    )

    expect(parseCmrCollectionsMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
