import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Service', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all service fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC',
              'native-id': 'test-guid',
              'association-details': {
                collections: [
                  {
                    data: '{"XYZ": "XYZ", "allow-regridding": true}',
                    'concept-id': 'C100000-EDSC'
                  }
                ]
              }
            },
            umm: {
              Description: 'Parturient Dolor Cras Aenean Dapibus',
              LongName: 'Parturient Egestas Lorem',
              Name: 'Parturient',
              RelatedURLs: [],
              ServiceOptions: {
                SupportedReformattings: [{
                  SupportedInputFormats: '',
                  SupportedOutputFormats: []
                }]
              },
              Type: 'Tristique',
              URL: {}
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          services {
            count
            items {
              associationDetails
              conceptId
              description
              longName
              name
              nativeId
              relatedUrls
              serviceOptions
              supportedReformattings
              type
              url
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        services: {
          count: 1,
          items: [{
            associationDetails: {
              collections: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'S100000-EDSC',
            description: 'Parturient Dolor Cras Aenean Dapibus',
            longName: 'Parturient Egestas Lorem',
            name: 'Parturient',
            nativeId: 'test-guid',
            relatedUrls: [],
            serviceOptions: {
              supportedReformattings: [{
                supportedInputFormats: '',
                supportedOutputFormats: []
              }]
            },
            supportedReformattings: [{
              supportedInputFormats: '',
              supportedOutputFormats: []
            }],
            type: 'Tristique',
            url: {}
          }]
        }
      })
    })

    test('services', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }, {
            concept_id: 'S100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          services(params: { limit: 2 }) {
            items {
              conceptId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        services: {
          items: [{
            conceptId: 'S100000-EDSC'
          }, {
            conceptId: 'S100001-EDSC'
          }]
        }
      })
    })

    describe('service', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id=S100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              service(params: { conceptId: "S100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            service: {
              conceptId: 'S100000-EDSC'
            }
          })
        })
      })

      describe('with revisions JUST json', () => {
        test('returns revisions', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id=S100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'all_revisions=true&concept_id=S100000-EDSC&page_size=20')
            .reply(200, {
              items: [
                {
                  concept_id: 'S100000-EDSC',
                  revision_id: '1',
                  provider_id: 'MMT_2',
                  native_id: 'service-50',
                  name: 'UARS_READ_SOFTWARE',
                  long_name: 'UARS Read Software'
                }
              ]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              service(params: { conceptId: "S100000-EDSC" }) {
                conceptId
                revisions {
                  items {
                    conceptId
                    revisionId
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            service: {
              conceptId: 'S100000-EDSC',
              revisions: {
                items: [
                  {
                    conceptId: 'S100000-EDSC',
                    revisionId: '1'
                  }
                ]
              }
            }
          })
        })
      })

      describe('with revisions umm_json', () => {
        test('returns revisions', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id=S100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.umm_json/, 'all_revisions=true&concept_id=S100000-EDSC&page_size=20')
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'S100000-EDSC',
                  'native-id': 'service-1',
                  'provider-id': 'MMT_2',
                  'revision-id': '2'
                },
                umm: {
                  RevisionDate: '2024-02-09T20:34:41.570Z',
                  Name: 'Example Name Modified',
                  LongName: 'Example Long Name Modified'
                }
              },
              {
                meta: {
                  'concept-id': 'S100000-EDSC',
                  'native-id': 'service-1',
                  'provider-id': 'MMT_2',
                  'revision-id': '1'
                },
                umm: {
                  RevisionDate: '2024-02-09T20:34:41.570Z',
                  Name: 'Example Name',
                  LongName: 'Example Long Name'
                }
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              service(params: { conceptId: "S100000-EDSC" }) {
                conceptId
                revisions {
                  items {
                    conceptId
                    revisionId
                    providerId
                    nativeId
                    name
                    longName
                    revisionDate
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            service: {
              conceptId: 'S100000-EDSC',
              revisions: {
                items: [
                  {
                    conceptId: 'S100000-EDSC',
                    longName: 'Example Long Name Modified',
                    name: 'Example Name Modified',
                    nativeId: 'service-1',
                    providerId: 'MMT_2',
                    revisionDate: '2024-02-09T20:34:41.570Z',
                    revisionId: '2'
                  },
                  {
                    conceptId: 'S100000-EDSC',
                    longName: 'Example Long Name',
                    name: 'Example Name',
                    nativeId: 'service-1',
                    providerId: 'MMT_2',
                    revisionDate: '2024-02-09T20:34:41.570Z',
                    revisionId: '1'
                  }
                ]
              }
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id=S100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              service(params: { conceptId: "S100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            service: null
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    test('deleteService', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .delete(/ingest\/providers\/EDSC\/services\/test-guid/)
        .reply(201, {
          'concept-id': 'S100000-EDSC',
          'revision-id': '1'
        })

      const response = await server.executeOperation({
        variables: {
          nativeId: 'test-guid',
          providerId: 'EDSC'
        },
        query: `mutation DeleteService (
            $providerId: String!
            $nativeId: String!
          ) {
            deleteService (
              providerId: $providerId
              nativeId: $nativeId
            ) {
                conceptId
                revisionId
              }
            }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult
      expect(data).toEqual({
        deleteService: {
          conceptId: 'S100000-EDSC',
          revisionId: '1'
        }
      })
    })
  })

  describe('when there are variable associations in the service metadata', () => {
    test('queries for and returns variables', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/)
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC',
            association_details: {
              variables: [{ concept_id: 'V100000-EDSC' }, { concept_id: 'V100001-EDSC' }]
            }
          }, {
            concept_id: 'S100001-EDSC',
            association_details: {
              variables: [{ concept_id: 'V100002-EDSC' }, { concept_id: 'V100003-EDSC' }]
            }
          }]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'concept_id[]=V100000-EDSC&concept_id[]=V100001-EDSC&page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }, {
            concept_id: 'V100001-EDSC'
          }]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'concept_id[]=V100002-EDSC&concept_id[]=V100003-EDSC&page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100002-EDSC'
          }, {
            concept_id: 'V100003-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          services {
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
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        services: {
          items: [{
            conceptId: 'S100000-EDSC',
            variables: {
              items: [{
                conceptId: 'V100000-EDSC'
              }, {
                conceptId: 'V100001-EDSC'
              }]
            }
          }, {
            conceptId: 'S100001-EDSC',
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

  describe('when there are no variable associations in the service metadata', () => {
    test('queries for and does not return any variables', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/)
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }, {
            concept_id: 'S100001-EDSC'
          }]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'concept_id[]=V100000-EDSC&concept_id[]=V100001-EDSC&page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }, {
            concept_id: 'V100001-EDSC'
          }]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'concept_id[]=V100002-EDSC&concept_id[]=V100003-EDSC&page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100002-EDSC'
          }, {
            concept_id: 'V100003-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          services {
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
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        services: {
          items: [{
            conceptId: 'S100000-EDSC',
            variables: {
              items: null
            }
          }, {
            conceptId: 'S100001-EDSC',
            variables: {
              items: null
            }
          }]
        }
      })
    })
  })

  describe('Service', () => {
    describe('collections', () => {
      test('returns collections when querying a published record', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/services\.json/)
          .reply(200, {
            items: [{
              concept_id: 'S100000-EDSC'
            }, {
              concept_id: 'S100001-EDSC'
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collections\.json/, 'page_size=20&service_concept_id=S100000-EDSC')
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC'
              }, {
                id: 'C100001-EDSC'
              }]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collections\.json/, 'page_size=20&service_concept_id=S100001-EDSC')
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100002-EDSC'
              }, {
                id: 'C100003-EDSC'
              }]
            }
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            services {
              items {
                conceptId
                collections {
                  items {
                    conceptId
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          services: {
            items: [{
              conceptId: 'S100000-EDSC',
              collections: {
                items: [{
                  conceptId: 'C100000-EDSC'
                }, {
                  conceptId: 'C100001-EDSC'
                }]
              }
            }, {
              conceptId: 'S100001-EDSC',
              collections: {
                items: [{
                  conceptId: 'C100002-EDSC'
                }, {
                  conceptId: 'C100003-EDSC'
                }]
              }
            }]
          }
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/service-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'SD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'SD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Service'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Service {
                    collections {
                      count
                    }
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                collections: null
              }
            }, {
              previewMetadata: {
                collections: null
              }
            }]
          }
        })
      })
    })

    describe('orderOptions query WITH parent collection', () => {
      describe('orderOptions query WITH parent collection', () => {
        // Tests for the associated legacy services order-options
        test('only retrieve one OO filtered from assoc details', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }, { concept_id: 'S200000-EDSC' }]
                  }
                }]
              }
            })
            // The association between the collection and the service contains the order-option in the payload
            .post(/services\.json/)
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC',
                association_details: {
                  collections: [{
                    data: {
                      order_option: 'OO100000-EDSC'
                    },
                    concept_id: 'C100000-EDSC'
                  },
                  {
                    data: {
                      order_option: 'OO100001-EDSC'
                    },
                    concept_id: 'C100001-EDSC'
                  }, {
                    data: {
                      order_option: 'OO100002-EDSC'
                    },
                    concept_id: 'C100002-EDSC'
                  },
                  {
                    data: {
                      order_option: 'OO1000003-EDSC'
                    },
                    concept_id: 'C100003-EDSC'
                  }]
                }
              },
              {
                concept_id: 'S200000-EDSC',
                association_details: {
                  collections: [{
                    data: {
                      order_option: 'OO200000-EDSC'
                    },
                    concept_id: 'C100000-EDSC'
                  },
                  {
                    data: {
                      order_option: 'OO100011-EDSC'
                    },
                    concept_id: 'C100011-EDSC'
                  }
                  ]
                }
              }]
            })
            .post(/order-options\.json/)
            .reply(200, {
              items: [{
                concept_id: 'OO100000-EDSC'
              }]
            })
            // The second oderOption list being retrieved by the second service assoc to the coll
            .post(/order-options\.json/)
            .reply(200, {
              items: [{ concept_id: 'OO200000-EDSC' }]
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: ['C100000-EDSC']
              }
            },
            query: `
              query ($params: CollectionsInput) {
                collections(params: $params) {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                      orderOptions{
                        items {
                          conceptId
                        }
                      }
                    }
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          // The expected result of the query only one OO is returned
          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  services: {
                    items: [
                      {
                        conceptId: 'S100000-EDSC',
                        orderOptions: {
                          items: [
                            {
                              conceptId: 'OO100000-EDSC'
                            }
                          ]
                        }
                      },
                      {
                        conceptId: 'S200000-EDSC',
                        orderOptions: {
                          items: [
                            {
                              conceptId: 'OO200000-EDSC'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          })
        })

        test('After filter check data payload fields existence', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }]
              }
            })
            // The association between the collection and the service contains the order-option in the payload
            .post(/services\.json/)
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC',
                association_details: {
                  collections: [{
                    data: {
                      order_option: 'OO100000-EDSC'
                    },
                    concept_id: 'C100000-EDSC'
                  },
                  {
                    data: {
                      order_option: 'OO100001-EDSC'
                    },
                    concept_id: 'C100001-EDSC'
                  }, {
                    data: {
                      order_option: 'OO100002-EDSC'
                    },
                    concept_id: 'C100002-EDSC'
                  },
                  {
                    data: {
                      order_option: 'OO1000022-EDSC'
                    },
                    concept_id: 'C100003-EDSC'
                  }]
                }
              }]
            })
            .post(/order-options\.json/)
            .reply(200, {
              items: [
                { concept_id: 'OO100000-EDSC' }]
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: 'C100000-EDSC'
              }
            },
            query: `
              query ($params: CollectionsInput) {
                collections(params: $params) {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                      orderOptions{
                        items {
                          conceptId
                        }
                      }
                    }
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          // The expected result of the query only one OO is returned
          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  services: {
                    items: [
                      {
                        conceptId: 'S100000-EDSC',
                        orderOptions: {
                          items: [
                            {
                              conceptId: 'OO100000-EDSC'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          })
        })

        test('No order options in the payload', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }]
              }
            })
            // The association between the collection and the service contains the order-option in the payload
            .post(/services\.json/)
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC',
                association_details: {
                  collections: [{
                    concept_id: 'C100000-EDSC'
                  }]
                }
              }]
            })

          // Pass the collection into the query
          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: 'C100000-EDSC'
              }
            },
            query: `
              query ($params: CollectionsInput) {
                collections(params: $params) {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                      orderOptions{
                        items {
                          conceptId
                        }
                      }
                    }
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          // The expected result of the query
          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  services: {
                    items: [
                      {
                        conceptId: 'S100000-EDSC',
                        orderOptions: {
                          items: null
                        }
                      }
                    ]
                  }
                }
              ]
            }
          })
        })

        test('No association back to the collection', async () => {
          nock(/example-cmr/)
          // Note I am not sure that this can happen in CMR
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }]
              }
            })
            // The association between the collection and the service contains the order-option in the payload
            .post(/services\.json/)
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC',
                // No association back to collection only with tools
                association_details: {
                  tools: [{
                    concept_id: 'T100000-EDSC'
                  }]
                }
              }]
            })

          // Pass the collection into the query
          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: 'C100000-EDSC'
              }
            },
            query: `
              query ($params: CollectionsInput) {
                collections(params: $params) {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                      orderOptions{
                        items {
                          conceptId
                        }
                      }
                    }
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          // The expected result of the query
          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  services: {
                    items: [
                      {
                        conceptId: 'S100000-EDSC',
                        orderOptions: {
                          items: null
                        }
                      }
                    ]
                  }
                }
              ]
            }
          })
        })

        test('No order_option field in the data payload in the association between the collection and service', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [
                      {
                        concept_id: 'S100000-EDSC',
                        data: {
                          key: 'value'
                        }
                      }
                    ]
                  }
                }]
              }
            })
            // The association between the collection and the service contains the order-option in the payload
            .post(/services\.json/)
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC',
                association_details: {
                  collections: [{
                    concept_id: 'C100000-EDSC',
                    data: {
                      key: 'value'
                    }
                  }]
                }
              }]
            })

          // Pass the collection into the query
          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: 'C100000-EDSC'
              }
            },
            query: `
              query ($params: CollectionsInput) {
                collections(params: $params) {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                      orderOptions{
                        items {
                          conceptId
                        }
                      }
                    }
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          // The expected result of the query
          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  services: {
                    items: [
                      {
                        conceptId: 'S100000-EDSC',
                        orderOptions: {
                          items: null
                        }
                      }
                    ]
                  }
                }
              ]
            }
          })
        })

        test('legacy services order-option not retrieved because there were NO associations on the collection', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
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

          // Pass the collection into the query
          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: 'C100000-EDSC'
              }
            },
            query: `
              query ($params: CollectionsInput) {
                collections(params: $params) {
                items {
                  conceptId
                  services {
                    items {
                      conceptId
                      orderOptions{
                        items {
                          conceptId
                        }
                      }
                    }
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          // The expected result of the query
          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  services: {
                    items: null
                  }
                }
              ]
            }
          })
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/service-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'SD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'SD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Service'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Service {
                    orderOptions {
                      count
                    }
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                orderOptions: null
              }
            }, {
              previewMetadata: {
                orderOptions: null
              }
            }]
          }
        })
      })
    })

    describe('orderOptions query WITHOUT parent collection', () => {
      test('order options from service no collection parent retrieves all order-options in the collection assoc', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/services\.json/)
          .reply(200, {
            items: [{
              concept_id: 'S100000-EDSC',
              association_details: {
                collections: [{
                  data: {
                    order_option: 'OO100000-EDSC'
                  },
                  concept_id: 'C100000-EDSC'
                },
                {
                  data: {
                    order_option: 'OO100001-EDSC'
                  },
                  concept_id: 'C100001-EDSC'
                }, {
                  data: {
                    order_option: 'OO100002-EDSC'
                  },
                  concept_id: 'C100002-EDSC'
                },
                {
                  data: {
                    order_option: 'OO1000003-EDSC'
                  },
                  concept_id: 'C100003-EDSC'
                }]
              }
            }]
          })
          .post(/order-options\.json/)
          .reply(200, {
            items: [{
              concept_id: 'OO100000-EDSC'
            }, {
              concept_id: 'OO100001-EDSC'
            }, {
              concept_id: 'OO100002-EDSC'
            }, {
              concept_id: 'OO100003-EDSC'
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            services {
              items {
                conceptId
                orderOptions {
                  items {
                    conceptId
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          services: {
            items: [{
              conceptId: 'S100000-EDSC',
              orderOptions: {
                items: [{
                  conceptId: 'OO100000-EDSC'
                },
                {
                  conceptId: 'OO100001-EDSC'
                },
                {
                  conceptId: 'OO100002-EDSC'
                },
                {
                  conceptId: 'OO100003-EDSC'
                }]
              }
            }]
          }
        })
      })

      test('Default no association details for orderOption query off of services', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/services\.json/)
          .reply(200, {
            items: [{
              concept_id: 'S100000-EDSC'
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            services {
              items {
                conceptId
                orderOptions {
                  items {
                    conceptId
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          services: {
            items: [{
              conceptId: 'S100000-EDSC',
              orderOptions: {
                items: null
              }
            }]
          }
        })
      })
    })

    describe('variables', () => {
      test('returns variables when querying a published record', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/services\.json/)
          .reply(200, {
            items: [{
              concept_id: 'S100000-EDSC',
              association_details: {
                variables: [{
                  concept_id: 'V100000-EDSC'
                }, {
                  concept_id: 'V100001-EDSC'
                }]
              }
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/variables\.json/, 'concept_id[]=V100000-EDSC&concept_id[]=V100001-EDSC&page_size=2')
          .reply(200, {
            items: [{
              concept_id: 'V100000-EDSC'
            }, {
              concept_id: 'V100001-EDSC'
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            services {
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
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          services: {
            items: [{
              conceptId: 'S100000-EDSC',
              variables: {
                items: [{
                  conceptId: 'V100000-EDSC'
                }, {
                  conceptId: 'V100001-EDSC'
                }]
              }
            }]
          }
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/service-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'SD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'SD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Service'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Service {
                    variables {
                      count
                    }
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                variables: null
              }
            }, {
              previewMetadata: {
                variables: null
              }
            }]
          }
        })
      })
    })

    describe('maxItemsPerOrder', () => {
      test('returns the maxItemsPerOrder for ECHO ORDERS service types', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/services\.json/)
          .reply(200, {
            items: [{
              concept_id: 'S100000-EDSC',
              provider_id: 'mockProvider',
              association_details: {
                collections: [{
                  data: {
                    order_option: 'OO100000-EDSC'
                  },
                  concept_id: 'C100000-EDSC'
                }]
              }
            }]
          })
          .post(/services\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'S100000-EDSC'
              },
              umm: {
                Type: 'ECHO ORDERS'
              }
            }]
          })
          .post(/ordering\/api/)
          .reply(200, {
            data: {
              maxItemsPerOrder: 2000
            }
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            services {
              items {
                conceptId
                maxItemsPerOrder
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          services: {
            items: [{
              conceptId: 'S100000-EDSC',
              maxItemsPerOrder: 2000
            }]
          }
        })
      })

      test('returns null for maxItemsPerOrder for non ECHO ORDERS service types', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/services\.json/)
          .reply(200, {
            items: [{
              concept_id: 'S100000-EDSC',
              provider_id: 'mockProvider',
              association_details: {
                collections: [{
                  data: {
                    order_option: 'OO100000-EDSC'
                  },
                  concept_id: 'C100000-EDSC'
                }]
              }
            }]
          })
          .post(/services\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'S100000-EDSC'
              },
              umm: {
                Type: 'ESI'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            services {
              items {
                conceptId
                maxItemsPerOrder
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          services: {
            items: [{
              conceptId: 'S100000-EDSC',
              maxItemsPerOrder: null
            }]
          }
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/service-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'SD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'SD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Service'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Service {
                    maxItemsPerOrder
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                maxItemsPerOrder: null
              }
            }, {
              previewMetadata: {
                maxItemsPerOrder: null
              }
            }]
          }
        })
      })
    })
  })
})
