import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('OrderOption', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all order option fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/order-options\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'OO100000-EDSC',
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
              Name: 'With Browse',
              Description: 'Parturient Dolor Cras Aenean Dapibus',
              Form: "<form xmlns=\"http://echo.nasa.gov/v9/echoforms\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> <model> <instance> <ecs:options xmlns:ecs=\"http://ecs.nasa.gov/options\"> <!-- ECS distribution options example --> <ecs:distribution> <ecs:mediatype> <ecs:value>FtpPull</ecs:value> </ecs:mediatype> <ecs:mediaformat> <ecs:ftppull-format> <ecs:value>FILEFORMAT</ecs:value> </ecs:ftppull-format> </ecs:mediaformat> </ecs:distribution> <ecs:do-ancillaryprocessing>true</ecs:do-ancillaryprocessing> <ecs:ancillary> <ecs:orderBrowse/> </ecs:ancillary> </ecs:options> </instance> </model> <ui> <group id=\"mediaOptionsGroup\" label=\"Media Options\" ref=\"ecs:distribution\"> <output id=\"MediaTypeOutput\" label=\"Media Type:\" relevant=\"ecs:mediatype/ecs:value ='FtpPull'\" type=\"xsd:string\" value=\"'HTTPS Pull'\"/> <output id=\"FtpPullMediaFormatOutput\" label=\"Media Format:\" relevant=\"ecs:mediaformat/ecs:ftppull-format/ecs:value='FILEFORMAT'\" type=\"xsd:string\" value=\"'File'\"/> </group> <group id=\"checkancillaryoptions\" label=\"Additional file options:\" ref=\"ecs:ancillary\" relevant=\"//ecs:do-ancillaryprocessing = 'true'\"> <input label=\"Include associated Browse file in order\" ref=\"ecs:orderBrowse\" type=\"xsd:boolean\"/> </group> </ui> </form>",
              Scope: 'PROVIDER',
              SortKey: 'Name'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          orderOptions {
            count
            items {
              associationDetails
              conceptId
              description
              form
              name
              nativeId
              scope
              sortKey
            }
          }
        }`
      }, {
        contextValue
      })
      const { data } = response.body.singleResult

      expect(data).toEqual({
        orderOptions: {
          count: 1,
          items: [{
            associationDetails: {
              collections: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'OO100000-EDSC',
            description: 'Parturient Dolor Cras Aenean Dapibus',
            form: "<form xmlns=\"http://echo.nasa.gov/v9/echoforms\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> <model> <instance> <ecs:options xmlns:ecs=\"http://ecs.nasa.gov/options\"> <!-- ECS distribution options example --> <ecs:distribution> <ecs:mediatype> <ecs:value>FtpPull</ecs:value> </ecs:mediatype> <ecs:mediaformat> <ecs:ftppull-format> <ecs:value>FILEFORMAT</ecs:value> </ecs:ftppull-format> </ecs:mediaformat> </ecs:distribution> <ecs:do-ancillaryprocessing>true</ecs:do-ancillaryprocessing> <ecs:ancillary> <ecs:orderBrowse/> </ecs:ancillary> </ecs:options> </instance> </model> <ui> <group id=\"mediaOptionsGroup\" label=\"Media Options\" ref=\"ecs:distribution\"> <output id=\"MediaTypeOutput\" label=\"Media Type:\" relevant=\"ecs:mediatype/ecs:value ='FtpPull'\" type=\"xsd:string\" value=\"'HTTPS Pull'\"/> <output id=\"FtpPullMediaFormatOutput\" label=\"Media Format:\" relevant=\"ecs:mediaformat/ecs:ftppull-format/ecs:value='FILEFORMAT'\" type=\"xsd:string\" value=\"'File'\"/> </group> <group id=\"checkancillaryoptions\" label=\"Additional file options:\" ref=\"ecs:ancillary\" relevant=\"//ecs:do-ancillaryprocessing = 'true'\"> <input label=\"Include associated Browse file in order\" ref=\"ecs:orderBrowse\" type=\"xsd:boolean\"/> </group> </ui> </form>",
            name: 'With Browse',
            nativeId: 'test-guid',
            scope: 'PROVIDER',
            sortKey: 'Name'
          }]
        }
      })
    })

    test('order options query', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/order-options\.json/)
        .reply(200, {
          items: [{
            concept_id: 'OO100000-EDSC'
          }, {
            concept_id: 'OO100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          orderOptions{
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
        orderOptions: {
          items: [{
            conceptId: 'OO100000-EDSC'
          }, {
            conceptId: 'OO100001-EDSC'
          }]
        }
      })
    })

    describe('orderOption', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/order-options.json?concept_id=OO100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'OO100000-EDSC',
                name: 'Lorem Ipsum'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              orderOption(params: { conceptId: "OO100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            orderOption: {
              conceptId: 'OO100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/order-options.json?concept_id=OO100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              orderOption(params: { conceptId: "OO100000-EDSC" }) {
                conceptId
                name
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            orderOption: null
          })
        })
      })
    })
  })

  describe('OrderOption', () => {
    describe('collections', () => {
      describe('when no keys are requested from the order option', () => {
        test('returns collections when querying a published record', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/order-options\.json/)
            .reply(200, {
              items: [{
                concept_id: 'OO100000-EDSC',
                associations: {
                  collections: ['C100000-EDSC']
                },
                associationDetails: {
                  collections: [{
                    concept_id: 'C100000-EDSC',
                    data: {}
                  }]
                }
              }, {
                concept_id: 'OO100001-EDSC',
                associations: {
                  collections: ['C100001-EDSC']
                },
                associationDetails: {
                  collections: [{
                    concept_id: 'C100001-EDSC',
                    data: {}
                  }]
                }
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.json?concept_id[]=C100000-EDSC&page_size=20')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.json?concept_id[]=C100001-EDSC&page_size=20')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              orderOptions {
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
            orderOptions: {
              items: [{
                conceptId: 'OO100000-EDSC',
                collections: {
                  items: [{
                    conceptId: 'C100000-EDSC'
                  }]
                }
              }, {
                conceptId: 'OO100001-EDSC',
                collections: {
                  items: [{
                    conceptId: 'C100001-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })

      describe('when only umm keys are requested from the order option', () => {
        test('returns collections when querying a published record', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/order-options\.umm_json/)
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'OO100000-EDSC',
                  associations: {
                    collections: ['C100000-EDSC']
                  },
                  'association-details': {
                    collections: [{
                      concept_id: 'C100000-EDSC',
                      data: {}
                    }]
                  }
                },
                umm: {
                  Form: '<Form />'
                }
              }, {
                meta: {
                  'concept-id': 'OO100001-EDSC',
                  associations: {
                    collections: ['C100001-EDSC']
                  },
                  'association-details': {
                    collections: [{
                      concept_id: 'C100001-EDSC',
                      data: {}
                    }]
                  }
                },
                umm: {
                  Form: '<Form />'
                }
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.json?concept_id[]=C100000-EDSC&page_size=20')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.json?concept_id[]=C100001-EDSC&page_size=20')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              orderOptions {
                items {
                  form
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
            orderOptions: {
              items: [{
                form: '<Form />',
                collections: {
                  items: [{
                    conceptId: 'C100000-EDSC'
                  }]
                }
              }, {
                form: '<Form />',
                collections: {
                  items: [{
                    conceptId: 'C100001-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })

      describe('when no associations are present', () => {
        test('returns collections an empty result', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/order-options\.umm_json/)
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'OO100000-EDSC'
                },
                umm: {
                  Form: '<Form />'
                }
              }, {
                meta: {
                  'concept-id': 'OO100001-EDSC'
                },
                umm: {
                  Form: '<Form />'
                }
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              orderOptions {
                items {
                  form
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
            orderOptions: {
              items: [{
                form: '<Form />',
                collections: {
                  items: null
                }
              }, {
                form: '<Form />',
                collections: {
                  items: null
                }
              }]
            }
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('createOrderOption', () => {
      test('calls the ingest endpoint to create an order option', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .put('/ingest/providers/TEST/order-options/test-native-id-2')
          .reply(200, {
            'concept-id': 'OO12341234-TEST',
            'revision-id': 1
          })

        const response = await server.executeOperation({
          variables: {
            description: 'This is a description',
            name: 'This is another new name',
            providerId: 'TEST',
            nativeId: 'test-native-id-2',
            form: 'This is the form'
          },
          query: `mutation CreateOrderOption($description: String!, $name: String!, $providerId: String!, $form: String!, $nativeId: String) {
            createOrderOption(description: $description, name: $name, providerId: $providerId, form: $form, nativeId: $nativeId) {
              conceptId
              revisionId
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          createOrderOption: {
            conceptId: 'OO12341234-TEST',
            revisionId: '1'
          }
        })
      })
    })

    describe('updateOrderOption', () => {
      test('calls the ingest endpoint to update an order option', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .put('/ingest/providers/TEST/order-options/test-native-id-2')
          .reply(200, {
            'concept-id': 'OO12341234-TEST',
            'revision-id': 2
          })

        const response = await server.executeOperation({
          variables: {
            description: 'This is a description',
            name: 'This is another new name',
            providerId: 'TEST',
            nativeId: 'test-native-id-2',
            form: 'This is the form'
          },
          query: `mutation UpdateOrderOption($description: String!, $name: String!, $providerId: String!, $form: String!, $nativeId: String!) {
            updateOrderOption(description: $description, name: $name, providerId: $providerId, form: $form, nativeId: $nativeId) {
              conceptId
              revisionId
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          updateOrderOption: {
            conceptId: 'OO12341234-TEST',
            revisionId: '2'
          }
        })
      })
    })

    describe('deleteOrderOption', () => {
      test('calls the ingest endpoint to delete an order option', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .delete('/ingest/providers/TEST/order-options/test-native-id-2')
          .reply(200, {
            'concept-id': 'OO12341234-TEST',
            'revision-id': 2
          })

        const response = await server.executeOperation({
          variables: {
            providerId: 'TEST',
            nativeId: 'test-native-id-2'
          },
          query: `mutation DeleteOrderOption($nativeId: String!, $providerId: String!) {
            deleteOrderOption(nativeId: $nativeId, providerId: $providerId) {
              conceptId
              revisionId
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          deleteOrderOption: {
            conceptId: 'OO12341234-TEST',
            revisionId: '2'
          }
        })
      })
    })
  })
})
