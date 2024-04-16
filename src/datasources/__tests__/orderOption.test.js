import nock from 'nock'

import { fetchOrderOption } from '../orderOption'

let requestInfo

describe('Order Option', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'orderOptions',
      alias: 'orderOptions',
      args: {},
      fieldsByTypeName: {
        OrderOptionList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              OrderOption: {
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

  describe('when fetching order options', () => {
    describe('cursor', () => {
      beforeEach(() => {
      // Overwrite default requestInfo
        requestInfo = {
          name: 'orderOptions',
          alias: 'orderOptions',
          args: {},
          fieldsByTypeName: {
            OrderOptionList: {
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
                  OrderOption: {
                    conceptId: {
                      name: 'conceptId',
                      alias: 'conceptId',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    description: {
                      name: 'description',
                      alias: 'description',
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
            'CMR-Search-After': '["xyz", 789, 999]'
          })
          .get(/order-options\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'OO100000-EDSC'
              },
              umm: {
                Description: 'Parturient Dolor Cras Aenean Dapibus'
              }
            }]
          })

        const response = await fetchOrderOption({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'OO100000-EDSC',
            description: 'Parturient Dolor Cras Aenean Dapibus'
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
              'CMR-Search-After': '["xyz", 789, 999]'
            })
            .post(/order-options\.umm_json/)
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'OO100000-EDSC'
                },
                umm: {
                  Description: 'Parturient Dolor Cras Aenean Dapibus'
                }
              }]
            })

          const response = await fetchOrderOption({}, {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          }, requestInfo)

          expect(response).toEqual({
            count: 84,
            cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
            items: [{
              conceptId: 'OO100000-EDSC',
              description: 'Parturient Dolor Cras Aenean Dapibus'
            }]
          })
        })
      })
    })

    describe('without params', () => {
      test('returns the parsed orderOption results', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/order-options\.json/)
          .reply(200, {
            items: [{
              concept_id: 'OO100000-EDSC'
            }]
          })

        const response = await fetchOrderOption({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: null,
          items: [{
            conceptId: 'OO100000-EDSC'
          }]
        })
      })
    })

    describe('with params', () => {
      test('returns the parsed orderOption results', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/order-options\.json/, 'concept_id=OO100000-EDSC')
          .reply(200, {
            items: [{
              concept_id: 'OO100000-EDSC'
            }]
          })

        const response = await fetchOrderOption({
          params: {
            concept_id: 'OO100000-EDSC'
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
            conceptId: 'OO100000-EDSC'
          }]
        })
      })
    })

    describe('with only umm keys', () => {
      beforeEach(() => {
        // Overwrite default requestInfo
        requestInfo = {
          name: 'orderOptions',
          alias: 'orderOptions',
          args: {},
          fieldsByTypeName: {
            OrderOptionList: {
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  OrderOption: {
                    description: {
                      name: 'description',
                      alias: 'description',
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

      test('returns the parsed orderOption results', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
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
                Description: 'Parturient Dolor Cras Aenean Dapibus'
              }
            }]
          })

        const response = await fetchOrderOption({
          params: {
            concept_id: 'OO100000-EDSC'
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
            description: 'Parturient Dolor Cras Aenean Dapibus'
          }]
        })
      })
    })

    test('Catches errors received from queryCmr', async () => {
      nock(/example-cmr/)
        .get(/order-options/)
        .reply(500, {
          errors: ['HTTP Error']
        }, {
          'cmr-request-id': 'abcd-1234-efgh-5678'
        })

      await expect(
        fetchOrderOption({
          params: {
            conceptId: 'OO100000-EDSC'
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
})
