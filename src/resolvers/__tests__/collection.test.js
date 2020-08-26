import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'
import { createTestClient } from 'apollo-server-testing'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import granuleSource from '../../datasources/granule'
import serviceSource from '../../datasources/service'
import toolSource from '../../datasources/tool'
import variableSource from '../../datasources/variable'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    granuleSource,
    serviceSource,
    toolSource,
    variableSource
  })
})

describe('Collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all collection fields', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              archive_center: 'CONDIMENTUM/TELLUS/PHARETRA',
              boxes: [],
              browse_flag: true,
              coordinate_system: 'CARTESIAN',
              data_center: 'PORTA',
              dataset_id: 'Condimentum Quam Mattis Cursus Pharetra',
              has_formats: true,
              has_granules: true,
              has_spatial_subsetting: true,
              has_temporal_subsetting: true,
              has_transforms: true,
              has_variables: true,
              id: 'C100000-EDSC',
              lines: [],
              online_access_flag: true,
              organizations: [],
              original_format: 'RISUS',
              points: [],
              polygons: [],
              short_name: 'LOREM-QUAM',
              summary: 'Cras mattis consectetur purus sit amet fermentum.',
              tags: {},
              time_end: '2016-04-04T08:00:00.000Z',
              time_start: '2016-04-04T17:00:00.000Z',
              title: 'Condimentum Quam Mattis Cursus Pharetra',
              version_id: '1.0.0'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Abstract: 'Cras mattis consectetur purus sit amet fermentum.',
              AncillaryKeywords: [],
              ArchiveAndDistributionInformation: {},
              CollectionCitations: [],
              ContactPersons: [],
              DataCenters: [],
              DOI: {},
              MetadataDates: [],
              Quality: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
              RelatedUrls: [],
              ScienceKeywords: [],
              SpatialExtent: {},
              TemporalExtents: [],
              EntryTitle: 'Condimentum Quam Mattis Cursus Pharetra',
              VersionId: '1.0.0'
            }
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          collections {
            count
            items {
              abstract
              ancillaryKeywords
              archiveAndDistributionInformation
              archiveCenter
              boxes
              browseFlag
              collectionCitations
              conceptId
              contactPersons
              coordinateSystem
              dataCenter
              dataCenters
              datasetId
              doi
              hasFormats
              hasGranules
              hasSpatialSubsetting
              hasTemporalSubsetting
              hasTransforms
              hasVariables
              lines
              metadataDates
              onlineAccessFlag
              organizations
              originalFormat
              points
              polygons
              quality
              relatedUrls
              scienceKeywords
              shortName
              spatialExtent
              tags
              temporalExtents
              timeEnd
              timeStart
              title
              versionId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        collections: {
          count: 1,
          items: [{
            abstract: 'Cras mattis consectetur purus sit amet fermentum.',
            ancillaryKeywords: [],
            archiveAndDistributionInformation: {},
            archiveCenter: 'CONDIMENTUM/TELLUS/PHARETRA',
            boxes: [],
            browseFlag: true,
            collectionCitations: [],
            conceptId: 'C100000-EDSC',
            contactPersons: [],
            coordinateSystem: 'CARTESIAN',
            dataCenter: 'PORTA',
            dataCenters: [],
            datasetId: 'Condimentum Quam Mattis Cursus Pharetra',
            doi: {},
            hasFormats: true,
            hasGranules: true,
            hasSpatialSubsetting: true,
            hasTemporalSubsetting: true,
            hasTransforms: true,
            hasVariables: true,
            lines: [],
            metadataDates: [],
            onlineAccessFlag: true,
            organizations: [],
            originalFormat: 'RISUS',
            points: [],
            polygons: [],
            quality: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            relatedUrls: [],
            scienceKeywords: [],
            shortName: 'LOREM-QUAM',
            spatialExtent: {},
            tags: {},
            temporalExtents: [],
            timeEnd: '2016-04-04T08:00:00.000Z',
            timeStart: '2016-04-04T17:00:00.000Z',
            title: 'Condimentum Quam Mattis Cursus Pharetra',
            versionId: '1.0.0'
          }]
        }
      })
    })

    test('collections', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'page_size=2')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      const response = await query({
        variables: {},
        query: `{
          collections(limit:2) {
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        collections: {
          items: [{
            conceptId: 'C100000-EDSC'
          }, {
            conceptId: 'C100001-EDSC'
          }]
        }
      })
    })

    describe('collection', () => {
      describe('with results', () => {
        test('returns results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/, 'concept_id=C100000-EDSC')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collection(conceptId: "C100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collection: {
              conceptId: 'C100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/, 'concept_id=C100000-EDSC')
            .reply(200, {
              feed: {
                entry: []
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collection(conceptId: "C100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collection: null
          })
        })
      })
    })
  })

  describe('Collection', () => {
    test('granules', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&collection_concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }, {
              id: 'G100001-EDSC'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&collection_concept_id=C100001-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100002-EDSC'
            }, {
              id: 'G100003-EDSC'
            }]
          }
        })

      const response = await query({
        variables: {},
        query: `{
          collections {
            items {
              conceptId
              granules {
                items {
                  conceptId
                }
              }
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        collections: {
          items: [{
            conceptId: 'C100000-EDSC',
            granules: {
              items: [{
                conceptId: 'G100000-EDSC'
              }, {
                conceptId: 'G100001-EDSC'
              }]
            }
          }, {
            conceptId: 'C100001-EDSC',
            granules: {
              items: [{
                conceptId: 'G100002-EDSC'
              }, {
                conceptId: 'G100003-EDSC'
              }]
            }
          }]
        }
      })
    })

    test('granules with arguments passed from the collection', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&bounding_box=-90.08940124511719%2C41.746426050239336%2C-82.33992004394531%2C47.84755587105307&collection_concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }, {
              id: 'G100001-EDSC'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&bounding_box=-90.08940124511719%2C41.746426050239336%2C-82.33992004394531%2C47.84755587105307&collection_concept_id=C100001-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100002-EDSC'
            }, {
              id: 'G100003-EDSC'
            }]
          }
        })

      const response = await query({
        variables: {},
        query: `{
          collections(
            limit:2
            boundingBox:"-90.08940124511719,41.746426050239336,-82.33992004394531,47.84755587105307"
          ) {
            items {
              conceptId
              granules {
                items {
                  conceptId
                }
              }
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        collections: {
          items: [{
            conceptId: 'C100000-EDSC',
            granules: {
              items: [{
                conceptId: 'G100000-EDSC'
              }, {
                conceptId: 'G100001-EDSC'
              }]
            }
          }, {
            conceptId: 'C100001-EDSC',
            granules: {
              items: [{
                conceptId: 'G100002-EDSC'
              }, {
                conceptId: 'G100003-EDSC'
              }]
            }
          }]
        }
      })
    })

    describe('services', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return services', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                services: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('association are present in the metadata but not service assocations', () => {
        test('doesn\'t query for or return services', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  associations: {
                    variables: ['V100000-EDSC']
                  }
                }, {
                  id: 'C100001-EDSC',
                  associations: {
                    variables: ['V100000-EDSC']
                  }
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                services: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when service associations are present in the metadata', () => {
        test(' queries for and returns services', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  associations: {
                    services: ['S100000-EDSC', 'S100001-EDSC']
                  }
                }, {
                  id: 'C100001-EDSC',
                  associations: {
                    services: ['S100002-EDSC', 'S100003-EDSC']
                  }
                }]
              }
            })

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id%5B%5D=S100000-EDSC&concept_id%5B%5D=S100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC'
              }, {
                concept_id: 'S100001-EDSC'
              }]
            })

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id%5B%5D=S100002-EDSC&concept_id%5B%5D=S100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'S100002-EDSC'
              }, {
                concept_id: 'S100003-EDSC'
              }]
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                services: {
                  items: [{
                    conceptId: 'S100000-EDSC'
                  }, {
                    conceptId: 'S100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: [{
                    conceptId: 'S100002-EDSC'
                  }, {
                    conceptId: 'S100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })

    describe('tools', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return tools', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  tools {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                tools: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('association are present in the metadata but not tool assocations', () => {
        test('doesn\'t query for or return tools', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  associations: {
                    variables: ['V100000-EDSC']
                  }
                }, {
                  id: 'C100001-EDSC',
                  associations: {
                    variables: ['V100000-EDSC']
                  }
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  tools {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                tools: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when tool associations are present in the metadata', () => {
        test(' queries for and returns tools', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  associations: {
                    tools: ['T100000-EDSC', 'T100001-EDSC']
                  }
                }, {
                  id: 'C100001-EDSC',
                  associations: {
                    tools: ['T100002-EDSC', 'T100003-EDSC']
                  }
                }]
              }
            })

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id%5B%5D=T100000-EDSC&concept_id%5B%5D=T100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'T100000-EDSC'
              }, {
                concept_id: 'T100001-EDSC'
              }]
            })

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id%5B%5D=T100002-EDSC&concept_id%5B%5D=T100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'T100002-EDSC'
              }, {
                concept_id: 'T100003-EDSC'
              }]
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  tools {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                tools: {
                  items: [{
                    conceptId: 'T100000-EDSC'
                  }, {
                    conceptId: 'T100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: [{
                    conceptId: 'T100002-EDSC'
                  }, {
                    conceptId: 'T100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })

    describe('variables', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return variables', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  variables {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                variables: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('association are present in the metadata but not variable assocations', () => {
        test('doesn\'t query for or return variables', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  associations: {
                    services: ['S100000-EDSC']
                  }
                }, {
                  id: 'C100001-EDSC',
                  associations: {
                    services: ['S100000-EDSC']
                  }
                }]
              }
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  variables {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                variables: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when service associations are present in the metadata', () => {
        test(' queries for and returns variables', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  associations: {
                    variables: ['V100000-EDSC', 'V100001-EDSC']
                  }
                }, {
                  id: 'C100001-EDSC',
                  associations: {
                    variables: ['V100002-EDSC', 'V100003-EDSC']
                  }
                }]
              }
            })

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id%5B%5D=V100000-EDSC&concept_id%5B%5D=V100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'V100000-EDSC'
              }, {
                concept_id: 'V100001-EDSC'
              }]
            })

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id%5B%5D=V100002-EDSC&concept_id%5B%5D=V100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'V100002-EDSC'
              }, {
                concept_id: 'V100003-EDSC'
              }]
            })

          const response = await query({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  variables {
                    items {
                      conceptId
                    }
                  }
                }
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                variables: {
                  items: [{
                    conceptId: 'V100000-EDSC'
                  }, {
                    conceptId: 'V100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: [{
                    conceptId: 'V100002-EDSC'
                  }, {
                    conceptId: 'V100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })
  })
})
