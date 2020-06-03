import nock from 'nock'

import { ApolloError } from 'apollo-server-lambda'

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
        CollectionList: {
          items: {
            name: 'items',
            alias: 'items',
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
        }
      }
    }
  })

  describe('without params', () => {
    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        }
      }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({}, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        {},
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              concept_id: 'C100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'C100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: {
                    cloud_cover: true,
                    day_night_flag: true,
                    granule_online_access_flag: true,
                    orbit_calculated_spatial_domains: false
                  }
                }
              }
            }]
          }
        }
      }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { concept_id: 'C100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              concept_id: 'C100000-EDSC',
              tags: {
                'edsc.extra.serverless.collection_capabilities': {
                  data: {
                    cloud_cover: true,
                    day_night_flag: true,
                    granule_online_access_flag: true,
                    orbit_calculated_spatial_domains: false
                  }
                }
              }
            }]
          }
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'C100000-EDSC',
          tags: {
            'edsc.extra.serverless.collection_capabilities': {
              data: {
                cloud_cover: true,
                day_night_flag: true,
                granule_online_access_flag: true,
                orbit_calculated_spatial_domains: false
              }
            }
          }
        }]
      })
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
          CollectionList: {
            items: {
              name: 'items',
              alias: 'items',
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
          }
        }
      }
    })

    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
            }]
          }
        }
      }, {
        headers: {
          'cmr-hits': 84
        },
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

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'colletion')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { concept_id: 'C100000-EDSC' },
        {
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        },
        expect.objectContaining({ jsonKeys: ['concept_id', 'title'], ummKeys: ['abstract'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = parseCmrCollectionsMock.mock.calls
      expect(jsonCall[0]).toEqual({
        headers: {
          'cmr-hits': 84
        },
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
        headers: {
          'cmr-hits': 84
        },
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

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'C100000-EDSC',
          abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
          title: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
        }]
      })
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
          CollectionList: {
            items: {
              name: 'items',
              alias: 'items',
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
          }
        }
      }
    })

    test('returns the parsed collection results', async () => {
      const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections').mockImplementationOnce(() => [
        null,
        {
          headers: {
            'cmr-hits': 84
          },
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

      const response = await collectionDatasource({ concept_id: 'C100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { concept_id: 'C100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['abstract', 'spatial_extent'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
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

      expect(response).toEqual({
        count: 84,
        items: [{
          abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
        }]
      })
    })
  })

  test('catches errors received from queryCmrCollections', async () => {
    nock(/localhost/)
      .post(/collections/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    const queryCmrCollectionsMock = jest.spyOn(queryCmrCollections, 'queryCmrCollections')

    const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

    await expect(
      collectionDatasource({ concept_id: 'C100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')
    ).rejects.toThrow(ApolloError)

    expect(queryCmrCollectionsMock).toBeCalledTimes(1)
    expect(queryCmrCollectionsMock).toBeCalledWith(
      { concept_id: 'C100000-EDSC' },
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['concept_id'] })
    )

    expect(parseCmrCollectionsMock).toBeCalledTimes(0)

    // expect(response).toThrow({ errors: ['HTTP Error'] })
  })
})
