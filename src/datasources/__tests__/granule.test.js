import nock from 'nock'

import granuleDatasource from '../granule'

let requestInfo

describe('granule', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'granules',
      alias: 'granules',
      args: {},
      fieldsByTypeName: {
        GranuleList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Granule: {
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
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
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
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
                Granule: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  dayNightFlag: {
                    name: 'dayNightFlag',
                    alias: 'dayNightFlag',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
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
        .get(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC',
              day_night_flag: 'UNSPECIFIED'
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
        .get(/granules\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        })

      const response = await granuleDatasource({
        cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0='
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
          conceptId: 'G100000-EDSC',
          dayNightFlag: 'UNSPECIFIED',
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
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
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'G100000-EDSC',
                day_night_flag: 'UNSPECIFIED'
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
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'G100000-EDSC'
              },
              umm: {
                GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
              }
            }]
          })

        const response = await granuleDatasource({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJqc29uIjoiW1wiYWJjXCIsIDEyMywgNDQ0XSIsInVtbSI6IltcInh5elwiLCA3ODksIDk5OV0ifQ==',
          items: [{
            conceptId: 'G100000-EDSC',
            dayNightFlag: 'UNSPECIFIED',
            granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed granule results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        })

      const response = await granuleDatasource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'G100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed granule results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        })

      const response = await granuleDatasource({
        params: {
          concept_id: 'G100000-EDSC'
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
          conceptId: 'G100000-EDSC'
        }]
      })
    })
  })

  describe('with linkTypes parameter', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  links: {
                    name: 'links',
                    alias: 'links',
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

    test('returns filtered links', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              links: [{
                href: 'https://example-cmr.com/data_link',
                hreflang: 'en-US',
                rel: 'https://example-cmr.com/data#',
                type: 'application/x-hdf5'
              }, {
                href: 'https://example-cmr.com/metadata_link',
                hreflang: 'en-US',
                rel: 'https://example-cmr.com/metadata#',
                type: 'application/x-hdf5'
              }, {
                href: 'https://example-cmr.com/s3_link',
                hreflang: 'en-US',
                rel: 'https://example-cmr.com/s3#',
                type: 'application/x-hdf5'
              }]
            }]
          }
        })

      const response = await granuleDatasource(
        {
          params: {
            collectionConceptId: 'C100000-EDSC',
            linkTypes: ['data', 's3']
          }
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        },
        requestInfo,
        'granule'
      )

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          links: [{
            href: 'https://example-cmr.com/data_link',
            hreflang: 'en-US',
            rel: 'https://example-cmr.com/data#',
            type: 'application/x-hdf5'
          }, {
            href: 'https://example-cmr.com/s3_link',
            hreflang: 'en-US',
            rel: 'https://example-cmr.com/s3#',
            type: 'application/x-hdf5'
          }]
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      process.env.maxRetries = '1'
      process.env.retryDelay = '1000'

      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  browseFlag: {
                    name: 'browseFlag',
                    alias: 'browseFlag',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
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

    test('returns the parsed granule results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC',
              browse_flag: true
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        })

      const response = await granuleDatasource({
        params: {
          concept_id: 'G100000-EDSC'
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
          conceptId: 'G100000-EDSC',
          browseFlag: true,
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
    })

    describe('when JSON and UMM hit counts differ, but returned items match', () => {
      test('return the parsed granule results', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 85,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'G100000-EDSC',
                browse_flag: true
              }]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'G100000-EDSC'
              },
              umm: {
                GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
              }
            }]
          })

        const response = await granuleDatasource({
          params: {
            concept_id: 'G100000-EDSC'
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
            conceptId: 'G100000-EDSC',
            browseFlag: true,
            granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
          }]
        })
      })
    })

    describe('when JSON and UMM hit counts differ and umm item count differ', () => {
      test('should fetch missing UMM data and return combined results with correct counts', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 3,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                },
                {
                  id: 'G100001-EDSC',
                  browse_flag: true
                },
                {
                  id: 'G100002-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'G100000-EDSC'
              },
              umm: {
                GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
              }
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'G100001-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100002-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
                }
              }
            ]
          })

        const response = await granuleDatasource({
          params: {
            concept_id: 'G100000-EDSC'
          }
        }, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 3,
          cursor: null,
          items: [
            {
              conceptId: 'G100000-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            },
            {
              conceptId: 'G100001-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
            },
            {
              conceptId: 'G100002-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
            }
          ]
        })
      })
    })

    describe('when JSON and UMM hit counts differ and json item count differ', () => {
      test('should fetch missing JSON data and return combined results with correct count', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 3,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'G100000-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100001-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100002-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
                }
              }

            ]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 3,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100001-EDSC',
                  browse_flag: true
                },
                {
                  id: 'G100002-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        const response = await granuleDatasource({
          params: {
            concept_id: 'G100000-EDSC'
          }
        }, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 3,
          cursor: null,
          items: [
            {
              conceptId: 'G100000-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            },
            {
              conceptId: 'G100001-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
            },
            {
              conceptId: 'G100002-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
            }
          ]
        })
      })
    })

    describe('when first retry does not get all of missing umm concepts', () => {
      test('should fetch missing concepts again and return combined result', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 3,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                },
                {
                  id: 'G100001-EDSC',
                  browse_flag: true
                },
                {
                  id: 'G100002-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'G100000-EDSC'
              },
              umm: {
                GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
              }
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'G100001-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
                }
              }
            ]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'G100001-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100002-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
                }
              }
            ]
          })

        const response = await granuleDatasource({
          params: {
            concept_id: 'G100000-EDSC'
          }
        }, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 3,
          cursor: null,
          items: [
            {
              conceptId: 'G100000-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            },
            {
              conceptId: 'G100001-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
            },
            {
              conceptId: 'G100002-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
            }
          ]
        })
      })
    })

    describe('when first retry does not get all of missing json concepts', () => {
      test('should fetch missing concepts again and return combined result', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 3,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'G100000-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100001-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100002-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
                }
              }

            ]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100001-EDSC',
                  browse_flag: true
                },
                {
                  id: 'G100002-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        const response = await granuleDatasource({
          params: {
            concept_id: 'G100000-EDSC'
          }
        }, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 3,
          cursor: null,
          items: [
            {
              conceptId: 'G100000-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            },
            {
              conceptId: 'G100001-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
            },
            {
              conceptId: 'G100002-EDSC',
              browseFlag: true,
              granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
            }
          ]
        })
      })
    })

    describe('when JSON and UMM hit counts differ and max retry attempts are reached', () => {
      test('throws an error after max retries', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 3,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.umm_json/)
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'G100000-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100001-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.021.nc4'
                }
              },
              {
                meta: {
                  'concept-id': 'G100002-EDSC'
                },
                umm: {
                  GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.022.nc4'
                }
              }

            ]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100000-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/granules\.json/)
          .reply(200, {
            feed: {
              entry: [
                {
                  id: 'G100001-EDSC',
                  browse_flag: true
                }
              ]
            }
          })

        await expect(granuleDatasource({
          params: { concept_id: 'G100000-EDSC' }
        }, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)).rejects.toThrow('Inconsistent data prevented GraphQL from correctly parsing results')
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  temporalExtent: {
                    name: 'temporalExtent',
                    alias: 'temporalExtent',
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

    test('returns the parsed granule results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        })

      const response = await granuleDatasource({
        params: {
          concept_id: 'G100000-EDSC'
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
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
    })
  })

  test('catches errors received from queryCmrGranules', async () => {
    nock(/example-cmr/)
      .get(/granules/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      granuleDatasource({
        params: {
          conceptId: 'G100000-EDSC'
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
