import nock from 'nock'

import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Service', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all service fields', async () => {
      nock(/example/)
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
      nock(/example/)
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
          nock(/example/)
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

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example/)
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

  describe('Service', () => {
    test('collections', async () => {
      nock(/example/)
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

      nock(/example/)
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

      nock(/example/)
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

    describe('orderOptions query WITH parent collection', () => {
      // Tests for the associated legacy services order-options
      test('only retrieve one OO filtered from assoc details', async () => {
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
        nock(/example/)
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
                association_details: {
                  services: [{ concept_id: 'S100000-EDSC', data: { key: 'value' } }]
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
                  concept_id: 'C100000-EDSC', data: { key: 'value' }
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

    describe('orderOptions query WITHOUT parent collection', () => {
      test('order options from service no collection parent retrieves all order-options in the collection assoc', async () => {
        nock(/example/)
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
        nock(/example/)
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
  })
})
