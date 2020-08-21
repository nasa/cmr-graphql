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
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
                  args: {},
                  fieldsByTypeName: {}
                },
                tags: {
                  name: 'tags',
                  alias: 'tags',
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

      const response = await collectionDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        {},
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId', 'tags'] })
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
          conceptId: 'C100000-EDSC'
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

      const response = await collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { conceptId: 'C100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId', 'tags'] })
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
          conceptId: 'C100000-EDSC',
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
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  doi: {
                    name: 'doi',
                    alias: 'doi',
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
              DOI: {
                DOI: 'doi:10.4225/15/5747A30'
              }
            }
          }]
        }
      }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'colletion')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { conceptId: 'C100000-EDSC' },
        {
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        expect.objectContaining({ jsonKeys: ['conceptId', 'title'], ummKeys: ['doi'] })
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
              DOI: {
                DOI: 'doi:10.4225/15/5747A30'
              }
            }
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          conceptId: 'C100000-EDSC',
          doi: {
            doi: 'doi:10.4225/15/5747A30'
          },
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
                  spatialExtent: {
                    name: 'spatialExtent',
                    alias: 'spatialExtent',
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
                'concept-id': 'C100000-EDSC',
                associations: {
                  services: [
                    'S100000-EDSC'
                  ]
                }
              },
              umm: {
                Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
              }
            }]
          }
        }])

      const parseCmrCollectionsMock = jest.spyOn(parseCmrCollections, 'parseCmrCollections')

      const response = await collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(queryCmrCollectionsMock).toBeCalledTimes(1)
      expect(queryCmrCollectionsMock).toBeCalledWith(
        { conceptId: 'C100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['abstract', 'spatialExtent'] })
      )

      expect(parseCmrCollectionsMock).toBeCalledTimes(1)
      expect(parseCmrCollectionsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC',
              associations: {
                services: [
                  'S100000-EDSC'
                ]
              }
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
          abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
          associations: {
            services: [
              'S100000-EDSC'
            ]
          },
          conceptId: 'C100000-EDSC'
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
      collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')
    ).rejects.toThrow(ApolloError)

    expect(queryCmrCollectionsMock).toBeCalledTimes(1)
    expect(queryCmrCollectionsMock).toBeCalledWith(
      { conceptId: 'C100000-EDSC' },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['conceptId', 'tags'] })
    )

    expect(parseCmrCollectionsMock).toBeCalledTimes(0)
  })
})
