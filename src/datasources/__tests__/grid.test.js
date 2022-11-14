import nock from 'nock'

import gridDatasource from '../grid'

let requestInfo

describe('grid', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'grids',
      alias: 'grids',
      args: {},
      fieldsByTypeName: {
        GridList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Grid: {
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
        name: 'grids',
        alias: 'grids',
        args: {},
        fieldsByTypeName: {
          GridList: {
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
                Grid: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  longName: {
                    name: 'name',
                    alias: 'name',
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
          'CMR-Search-After': '["xyz", 789, 999]'
        })
        .post(/grids\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'GRD100000-EDSC'
            },
            umm: {
              LongName: 'grid_name'
            }
          }]
        })
      const response = await gridDatasource({}, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
        items: [{
          conceptId: 'GRD100000-EDSC',
          longName: 'grid_name'
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
            'CMR-Search-After': '["xyz", 789, 999]'
          })
          .post(/grids\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'GRD100000-EDSC'
              },
              umm: {
                LongName: 'grid_name'
              }
            }]
          })

        const response = await gridDatasource({}, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'GRD100000-EDSC',
            longName: 'grid_name'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed grid results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/grids\.json/)
        .reply(200, {
          items: [{
            concept_id: 'GRD100000-EDSC'
          }]
        })

      const response = await gridDatasource({}, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'GRD100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed grid results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/grids\.json/, 'concept_id=GRD100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'GRD100000-EDSC'
          }]
        })

      const response = await gridDatasource({ params: { concept_id: 'GRD100000-EDSC' } }, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'GRD100000-EDSC'
        }]
      })
    })
  })
  // // One of the keys is concept-id which is shared, one is json, and the other is umm_json
  // describe('with json and umm keys', () => {
  //   beforeEach(() => {
  //     // Overwrite default requestInfo
  //     requestInfo = {
  //       name: 'grids',
  //       alias: 'grids',
  //       args: {},
  //       fieldsByTypeName: {
  //         GridList: {
  //           items: {
  //             name: 'items',
  //             alias: 'items',
  //             args: {},
  //             fieldsByTypeName: {
  //               Grid: {
  //                 conceptId: {
  //                   name: 'conceptId',
  //                   alias: 'conceptId',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 browseFlag: {
  //                   name: 'browseFlag',
  //                   alias: 'browseFlag',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 organization: {
  //                   name: 'granuleUr',
  //                   alias: 'granuleUr',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })

  //   test('returns the parsed grid results', async () => {
  //     nock(/example/)
  //       .defaultReplyHeaders({
  //         'CMR-Hits': 84,
  //         'CMR-Took': 7,
  //         'CMR-Request-Id': 'abcd-1234-efgh-5678'
  //       })
  //       .post(/grids\.json/)
  //       .reply(200, {
  //         feed: {
  //           entry: [{
  //             id: 'G100000-EDSC',
  //             browse_flag: true
  //           }]
  //         }
  //       })

  //     nock(/example/)
  //       .defaultReplyHeaders({
  //         'CMR-Hits': 84,
  //         'CMR-Took': 7,
  //         'CMR-Request-Id': 'abcd-1234-efgh-5678'
  //       })
  //       .post(/grids\.umm_json/)
  //       .reply(200, {
  //         items: [{
  //           meta: {
  //             'concept-id': 'G100000-EDSC'
  //           },
  //           umm: {
  //             GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
  //           }
  //         }]
  //       })

  //     const response = await gridDatasource({ params: { concept_id: 'GRD100000-EDSC' } }, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)

  //     expect(response).toEqual({
  //       count: 84,
  //       cursor: null,
  //       items: [{
  //         conceptId: 'G100000-EDSC',
  //         browseFlag: true,
  //         granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
  //       }]
  //     })
  //   })
  // })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'grids',
        alias: 'grids',
        args: {},
        fieldsByTypeName: {
          GridList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Grid: {
                  longName: {
                    name: 'grid_name',
                    alias: 'name',
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

    test('returns the parsed grid results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/grids\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'GRD100000-EDSC'
            },
            umm: {
              LongName: 'grid_name'
            }
          }]
        })

      const response = await gridDatasource({ params: { concept_id: 'GRD100000-EDSC' } }, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          longName: 'grid_name'
        }]
      })
    })
  })

  test('Catches errors received from queryCmr', async () => {
    nock(/example/)
      .post(/grids/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      gridDatasource({ params: { conceptId: 'GRD100000-EDSC' } }, { headers: { 'CMR-Request-Id': 'abcd-1234-efgh-5678' } }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
