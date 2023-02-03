import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import granuleSource from '../../datasources/granule'
import orderOptionSource from '../../datasources/orderOption'
import serviceSource from '../../datasources/service'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../datasources/subscription'
import toolSource from '../../datasources/tool'
import variableSource from '../../datasources/variable'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'Client-Id': 'eed-test-graphql',
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    granuleSource,
    orderOptionSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolSource,
    variableSource
  })
})

describe('Service', () => {
  const OLD_ENV = process.env
  // jest.resetAllMocks()
  // jest.restoreAllMocks()

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
      })

      const { data } = response

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
      })

      const { data } = response

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
          })

          const { data } = response

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
          })

          const { data } = response

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
      })

      const { data } = response

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
    test('order-option associations are returned', async () => {
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
              'order-options': [{ concept_id: 'OO100000-EDSC' }]
            }
          }]
        })
      // Mock the order option
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/order-options\.json/)
        .reply(200, {
          items: [
            { concept_id: 'OO100000-EDSC' }]
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
      })

      const { data } = response
      expect(data).toEqual({
        services: {
          items: [{
            conceptId: 'S100000-EDSC',
            orderOptions: {
              items: [{
                conceptId: 'OO100000-EDSC'
              }]
            }
          }]
        }
      })
    })

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
      // Mock the order option
      // nock(/example/)
      //   .defaultReplyHeaders({
      //     'CMR-Took': 7,
      //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
      //   })
        .post(/order-options\.json/)
        .reply(200, {
          items: [
            { concept_id: 'OO100000-EDSC' }]
        })
      // Pass the collection into the query
      const response = await server.executeOperation({
        variables: { params: { conceptId: 'C100000-EDSC' } },
        query: `
        query ($params: CollectionsInput) {
          collections(params: $params) {
          items {
            conceptId
            services {
              items {
                conceptId
                associatedOrderOptions{
                  items {
                    conceptId
                  }
                }
              }
            }
          }
        }
        }`
      })
      // The expected result of the query
      const { data } = response
      console.log(data)
      expect(data).toEqual({
        collections: {
          items: [
            {
              conceptId: 'C100000-EDSC',
              services: {
                items: [
                  {
                    conceptId: 'S100000-EDSC',
                    associatedOrderOptions: {
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

    test('legacy services order-option retrieved on association for service only one collection between them', async () => {
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
              }]
            }
          }]
        })
      // Mock the order option
      // nock(/example/)
      //   .defaultReplyHeaders({
      //     'CMR-Took': 7,
      //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
      //   })
        .post(/order-options\.json/)
        .reply(200, {
          items: [
            { concept_id: 'OO100000-EDSC' }]
        })
      // Pass the collection into the query
      const response = await server.executeOperation({
        variables: { params: { conceptId: 'C100000-EDSC' } },
        query: `
        query ($params: CollectionsInput) {
          collections(params: $params) {
          items {
            conceptId
            services {
              items {
                conceptId
                associatedOrderOptions{
                  items {
                    conceptId
                  }
                }
              }
            }
          }
        }
        }`
      })
      // The expected result of the query
      const { data } = response
      console.log(data)
      expect(data).toEqual({
        collections: {
          items: [
            {
              conceptId: 'C100000-EDSC',
              services: {
                items: [
                  {
                    conceptId: 'S100000-EDSC',
                    associatedOrderOptions: {
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

    test('legacy services order-option cant retrieved no collection association tool instead', async () => {
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
                tools: [{ concept_id: 'T100000-EDSC' }]
              }
            }]
          }
        })
        // The association between the collection and the service contains the order-option in the payload
        // .post(/services\.json/)
        // .reply(200, {
        //   items: [{
        //     concept_id: 'S100000-EDSC',
        //     association_details: {
        //       variables: [{
        //         concept_id: 'V100000-EDSC'
        //       }]
        //     }
        //   }]
        // })
      // Mock the order option
      // nock(/example/)
      //   .defaultReplyHeaders({
      //     'CMR-Took': 7,
      //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
      //   })
      // Pass the collection into the query
      const response = await server.executeOperation({
        variables: { params: { conceptId: 'C100000-EDSC' } },
        query: `
        query ($params: CollectionsInput) {
          collections(params: $params) {
          items {
            conceptId
            services {
              items {
                conceptId
                associatedOrderOptions{
                  items {
                    conceptId
                  }
                }
              }
            }
          }
        }
        }`
      })
      // The expected result of the query
      const { data } = response
      // console.log(data)
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

    test('legacy services order-option retrieved but, there were no order options in th payload', async () => {
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
      // Mock the order option
      // nock(/example/)
      //   .defaultReplyHeaders({
      //     'CMR-Took': 7,
      //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
      //   })
        // No order-options were returned
        // .post(/order-options\.json/)
        // .reply(200, {
        //   items: []
        // })
      // Pass the collection into the query
      const response = await server.executeOperation({
        variables: { params: { conceptId: 'C100000-EDSC' } },
        query: `
        query ($params: CollectionsInput) {
          collections(params: $params) {
          items {
            conceptId
            services {
              items {
                conceptId
                associatedOrderOptions{
                  items {
                    conceptId
                  }
                }
              }
            }
          }
        }
        }`
      })
      // The expected result of the query
      const { data } = response
      console.log(data)
      expect(data).toEqual({
        collections: {
          items: [
            {
              conceptId: 'C100000-EDSC',
              services: {
                items: [
                  {
                    conceptId: 'S100000-EDSC',
                    associatedOrderOptions: {
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
        variables: { params: { conceptId: 'C100000-EDSC' } },
        query: `
        query ($params: CollectionsInput) {
          collections(params: $params) {
          items {
            conceptId
            services {
              items {
                conceptId
                associatedOrderOptions{
                  items {
                    conceptId
                  }
                }
              }
            }
          }
        }
        }`
      })
      // The expected result of the query
      const { data } = response
      console.log(data)
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
    describe('no params test', () => {
      const OLD_ENV = process.env

      beforeEach(() => {
        process.env = { ...OLD_ENV }
        process.env.cmrRootUrl = 'http://other.com'
      })
      afterEach(() => {
        process.env = OLD_ENV
      })
      test('legacy services order-option retrieved on an association to coll no param passed return all associated order-options', async () => {
        nock(/other/)
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
                  services: [{
                    data: {
                      order_option: 'OO100000-EDSC'
                    },
                    concept_id: 'S100000-EDSC'
                  }]
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
              { concept_id: 'OO100000-EDSC' },
              { concept_id: 'OO100001-EDSC' },
              { concept_id: 'OO100002-EDSC' },
              { concept_id: 'OO100003-EDSC' }
            ]
          })
        // Pass the collection into the query
        const response = await server.executeOperation({
          variables: {},
          query: `
        { collections {
          items {
            conceptId
            services {
              items {
                associatedOrderOptions{
                  items {
                    conceptId
                  }
                }
              }
            }
          }
        }
      }`
        })
        // The expected result of the query
        const { data } = response
        expect(data).toEqual({
          collections: {
            items: [
              {
                conceptId: 'C100000-EDSC',
                services: {
                  items: [
                    {
                      associatedOrderOptions: {
                        items: [
                          {
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
    })
    // This is in case there is no associations at all

    test('tool association but, no order option association', async () => {
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
              tools: [{ concept_id: 'TL100000-EDSC' }]
            }
          }]
        })
      // Mock the order option
      // nock(/example/)
      //   .defaultReplyHeaders({
      //     'CMR-Took': 7,
      //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
      //   })
        .post(/order-options\.json/)
        .reply(200, {
          items: [
            { concept_id: 'OO100000-EDSC' }]
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
      })

      const { data } = response
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
    test('service has no associations', async () => {
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
      // // Mock the order option
      // nock(/example/)
      //   .defaultReplyHeaders({
      //     'CMR-Took': 7,
      //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
      //   })
        .post(/order-options\.json/)
        .reply(200, {
          items: [
            { concept_id: 'OO100000-EDSC' }]
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
      })

      const { data } = response
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
  // THIS IS NOW it's own thing
  // test('legacy services order-option no association details at all on the concepts', async () => {
  //   nock(/example/)
  //     .defaultReplyHeaders({
  //       'CMR-Took': 7,
  //       'CMR-Request-Id': 'abcd-1234-efgh-5678'
  //     })
  //     // The association between the collection and the service contains the order-option in the payload
  //     .post(/services\.json/, 'conceptId=S100006-EDSC')
  //     .reply(200, {
  //       items: [{
  //         concept_id: 'S100006-EDSC'
  //       }]
  //     })
  //     // Mock the order option
  //     // nock(/example/)
  //     //   .defaultReplyHeaders({
  //     //     'CMR-Took': 7,
  //     //     'CMR-Request-Id': 'abcd-1234-efgh-5678'
  //     //   })
  //     // Pass the collection into the query
  //   const response = await server.executeOperation({
  //     variables: { params: { conceptId: 'S100006-EDSC' } },
  //     query: `
  //     query ($params: ServicesInput) {
  //       services(params: $params) {
  //         items {
  //           conceptId
  //           associatedOrderOptions{
  //               items {
  //                 conceptId
  //               }
  //             }
  //           }
  //         }
  //     }`
  //   })
  //   // The expected result of the query
  //   const { data } = response
  //   // console.log(data)
  //   expect(data).toEqual({
  //     services: {
  //       items: [
  //         {
  //           conceptId: 'S100000-EDSC',
  //           associatedOrderOptions: {
  //             items: null
  //           }
  //         }
  //       ]
  //     }
  //   })
  // })
})
