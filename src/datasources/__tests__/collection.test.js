import nock from 'nock'

import {
  deleteCollection as collectionSourceDelete,
  fetchCollections as collectionSourceFetch
} from '../collection'

let requestInfo

describe('collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

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
                  onlineAccessFlag: {
                    name: 'onlineAccessFlag',
                    alias: 'onlineAccessFlag',
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
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Search-After': '["abc", 123, 444]'
        })
        .get(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              online_access_flag: false
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Search-After': '["xyz", 789, 999]'
        })
        .get(/collections\.umm_json/)
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

      const response = await collectionSourceFetch({
        params: {
          cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0='
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJqc29uIjoiW1wiYWJjXCIsIDEyMywgNDQ0XSIsInVtbSI6IltcInh5elwiLCA3ODksIDk5OV0ifQ==',
        items: [{
          conceptId: 'C100000-EDSC',
          doi: {
            doi: 'doi:10.4225/15/5747A30'
          },
          onlineAccessFlag: false
        }]
      })
    })

    describe('when a cursor is requested', () => {
      test('requests a cursor', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Search-After': '["abc", 123, 444]'
          })
          .get(/collections\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC',
                online_access_flag: false
              }]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Search-After': '["xyz", 789, 999]'
          })
          .get(/collections\.umm_json/)
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

        const response = await collectionSourceFetch({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJqc29uIjoiW1wiYWJjXCIsIDEyMywgNDQ0XSIsInVtbSI6IltcInh5elwiLCA3ODksIDk5OV0ifQ==',
          items: [{
            conceptId: 'C100000-EDSC',
            doi: {
              doi: 'doi:10.4225/15/5747A30'
            },
            onlineAccessFlag: false
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed collection results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      const response = await collectionSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'C100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed collection results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/collections\.json/)
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

      const response = await collectionSourceFetch({
        params: {
          conceptId: 'C100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
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
                  onlineAccessFlag: {
                    name: 'onlineAccessFlag',
                    alias: 'onlineAccessFlag',
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
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/collections.json?concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              online_access_flag: false
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/collections.umm_json?concept_id=C100000-EDSC')
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

      const response = await collectionSourceFetch({
        params: {
          conceptId: 'C100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'C100000-EDSC',
          doi: {
            doi: 'doi:10.4225/15/5747A30'
          },
          onlineAccessFlag: false
        }]
      })
    })
  })

  describe('with keys that support singular and plural values', () => {
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
                  dataCenter: {
                    name: 'dataCenter',
                    alias: 'dataCenter',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  doi: {
                    name: 'doi',
                    alias: 'doi',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  onlineAccessFlag: {
                    name: 'onlineAccessFlag',
                    alias: 'onlineAccessFlag',
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
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/collections.json?data_center[]=EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              data_center: 'EDSC',
              online_access_flag: false
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/collections.umm_json?data_center[]=EDSC')
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

      const response = await collectionSourceFetch({
        params: {
          dataCenters: ['EDSC']
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'C100000-EDSC',
          dataCenter: 'EDSC',
          doi: {
            doi: 'doi:10.4225/15/5747A30'
          },
          onlineAccessFlag: false
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
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/collections.umm_json?concept_id=C100000-EDSC')
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC',
              'association-details': {
                services: [
                  { 'concept-id': 'S100000-EDSC' }
                ]
              }
            },
            umm: {
              Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
              SpatialExtent: {}
            }
          }]
        })

      const response = await collectionSourceFetch({
        params: {
          conceptId: 'C100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
          associationDetails: {
            services: [
              { conceptId: 'S100000-EDSC' }
            ]
          },
          spatialExtent: {}
        }]
      })
    })
  })

  test('catches errors received from queryCmrCollections', async () => {
    nock(/example-cmr/)
      .get(/collections/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      collectionSourceFetch({
        params: {
          conceptId: 'C100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})

describe('collection#delete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'collectionDelete',
      alias: 'collectionDelete',
      args: {
        conceptId: 'C100000-EDSC',
        nativeId: 'test-guid'
      },
      fieldsByTypeName: {
        CollectionMutationResponse: {
          conceptId: {
            name: 'conceptId',
            alias: 'conceptId',
            args: {},
            fieldsByTypeName: {}
          },
          revisionId: {
            name: 'revisionId',
            alias: 'revisionId',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns the CMR results', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .delete(/ingest\/providers\/EDSC\/collections\/test-guid/)
      .reply(201, {
        'concept-id': 'C100000-EDSC',
        'revision-id': '1'
      })

    const response = await collectionSourceDelete({
      nativeId: 'test-guid',
      providerId: 'EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'C100000-EDSC',
      revisionId: '1'
    })
  })

  test('catches errors received from cmrDelete', async () => {
    nock(/example-cmr/)
      .delete(/ingest\/providers\/EDSC\/collections\/test-guid/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      collectionSourceDelete({
        nativeId: 'test-guid',
        providerId: 'EDSC'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
