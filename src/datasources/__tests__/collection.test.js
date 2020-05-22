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
          concept_id: {
            name: 'concept_id',
            alias: 'concept_id',
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
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              concept_id: 'C100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        concept_id: 'C100000-EDSC'
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

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { concept_id: 'C100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              concept_id: 'C100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        concept_id: 'C100000-EDSC'
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
            concept_id: {
              name: 'concept_id',
              alias: 'concept_id',
              args: {},
              fieldsByTypeName: {}
            },
            abstract: {
              name: 'abstract',
              alias: 'abstract',
              args: {},
              fieldsByTypeName: {}
            },
            title: {
              name: 'title',
              alias: 'title',
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
              id: 'C100000-EDSC',
              title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
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

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { concept_id: 'C100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id', 'title'], ummKeys: ['abstract'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = parseCmrCollectionsMock.mock.calls
      expect(jsonCall[0]).toEqual({
        data: {
          feed: {
            entry: [{
              concept_id: 'C100000-EDSC',
              title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
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
        concept_id: 'C100000-EDSC',
        abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
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
            },
            spatial_extent: {
              name: 'spatial_extent',
              alias: 'spatial_extent',
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

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, {}, requestInfo)

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { concept_id: 'C100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: [], ummKeys: ['abstract', 'spatial_extent'] })
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

    const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, {}, requestInfo)

    expect(queryCmrCollectionsMock).toBeCalledTimes(1)
    expect(queryCmrCollectionsMock).toBeCalledWith(
      { concept_id: 'C100000-EDSC' },
      {},
      expect.objectContaining({ jsonKeys: ['concept_id'] })
    )

    expect(parseCmrCollectionsMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
