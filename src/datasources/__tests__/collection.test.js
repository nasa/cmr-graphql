import nock from 'nock'

import collectionDatasource from '../collection'

let requestInfo

describe('collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
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

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('cursor', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'collections',
        alias: 'collections',
        args: {},
        fieldsByTypeName: {
          CollectionList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {}
            },
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
                  hasSpatialSubsetting: {
                    name: 'hasSpatialSubsetting',
                    alias: 'hasSpatialSubsetting',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  doi: {
                    name: 'doi',
                    alias: 'doi',
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

    test('returns a cursor', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-29834750'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              has_spatial_subsetting: false
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-98726357'
        })
        .post(/collections\.umm_json/)
        .reply(200, {
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
        })

      const response = await collectionDatasource({ cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=',
        items: [{
          conceptId: 'C100000-EDSC',
          doi: {
            doi: 'doi:10.4225/15/5747A30'
          },
          hasSpatialSubsetting: false
        }]
      })
    })

    describe('when a cursor is requested', () => {
      test('requests a cursor', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-29834750'
          })
          .post(/collections\.json/, 'scroll=true')
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC',
                has_spatial_subsetting: false
              }]
            }
          })

        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/collections\.umm_json/, 'scroll=true')
          .reply(200, {
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
          })

        const response = await collectionDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=',
          items: [{
            conceptId: 'C100000-EDSC',
            doi: {
              doi: 'doi:10.4225/15/5747A30'
            },
            hasSpatialSubsetting: false
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed collection results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      const response = await collectionDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'C100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed collection results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
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
        })

      const response = await collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
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
                  hasSpatialSubsetting: {
                    name: 'hasSpatialSubsetting',
                    alias: 'hasSpatialSubsetting',
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
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              has_spatial_subsetting: false
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.umm_json/, 'concept_id=C100000-EDSC')
        .reply(200, {
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
        })

      const response = await collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'colletion')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'C100000-EDSC',
          doi: {
            doi: 'doi:10.4225/15/5747A30'
          },
          hasSpatialSubsetting: false
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
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.umm_json/, 'concept_id=C100000-EDSC')
        .reply(200, {
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
              Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
              SpatialExtent: {}
            }
          }]
        })

      const response = await collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
          associations: {
            services: [
              'S100000-EDSC'
            ]
          },
          spatialExtent: {}
        }]
      })
    })
  })

  test('catches errors received from queryCmrCollections', async () => {
    nock(/example/)
      .post(/collections/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      collectionDatasource({ conceptId: 'C100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')
    ).rejects.toThrow(Error)
  })
})
