import nock from 'nock'

import {
  deleteVisualization as visualizationSourceDelete,
  restoreVisualizationRevision as visualizationSourceRestoreRevision,
  fetchVisualizations as visualizationSourceFetch
} from '../visualization'

let requestInfo

describe('visualization#fetch', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'visualizations',
      alias: 'visualizations',
      args: {},
      fieldsByTypeName: {
        VisualizationList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Visualization: {
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
        name: 'visualizations',
        alias: 'visualizations',
        args: {},
        fieldsByTypeName: {
          VisualizationList: {
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
                Visualization: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  visualizationType: {
                    name: 'visualizationType',
                    alias: 'visualizationType',
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
        .get(/visualizations\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'VIS100000-EDSC'
            },
            umm: {
              VisualizationType: 'tiles'
            }
          }]
        })

      const response = await visualizationSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
        items: [{
          conceptId: 'VIS100000-EDSC',
          visualizationType: 'tiles'
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
          .get(/visualizations\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'VIS100000-EDSC'
              },
              umm: {
                VisualizationType: 'tiles'
              }
            }]
          })

        const response = await visualizationSourceFetch({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'VIS100000-EDSC',
            visualizationType: 'tiles'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed visualization results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/visualizations\.json/)
        .reply(200, {
          items: [{
            concept_id: 'VIS100000-EDSC'
          }]
        })

      const response = await visualizationSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'VIS100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed visualization results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/visualizations.json?concept_id=VIS100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'VIS100000-EDSC'
          }]
        })

      const response = await visualizationSourceFetch({
        params: {
          concept_id: 'VIS100000-EDSC'
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
          conceptId: 'VIS100000-EDSC'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'visualizations',
        alias: 'visualizations',
        args: {},
        fieldsByTypeName: {
          VisualizationList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Visualization: {
                  visualizationType: {
                    name: 'visualizationType',
                    alias: 'visualizationType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
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

    test('returns the parsed visualization results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/visualizations\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'VIS100000-EDSC'
            },
            umm: {
              Title: 'Test Visualization',
              VisualizationType: 'tiles'
            }
          }]
        })

      const response = await visualizationSourceFetch({
        params: {
          concept_id: 'VIS100000-EDSC'
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
          title: 'Test Visualization',
          visualizationType: 'tiles'
        }]
      })
    })
  })

  test('catches errors received from queryCmrVisualizations', async () => {
    nock(/example-cmr/)
      .get(/visualizations/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      visualizationSourceFetch({
        params: {
          conceptId: 'VIS100000-EDSC'
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

describe('restoreVisualizationRevision', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'visualizationDelete',
      alias: 'visualizationDelete',
      args: {
        conceptId: 'VIS100000-EDSC',
        revisionId: '1'
      },
      fieldsByTypeName: {
        VisualizationMutationResponse: {
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
      .get('/search/visualizations.umm_json?concept_id=VIS100000-EDSC&all_revisions=true')
      .reply(200, {
        items: [{
          meta: {
            'concept-id': 'VIS100000-EDSC',
            'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            'revision-id': 1
          },
          umm: {
            LongName: 'Tortor Elit Fusce Quam Risus'
          }
        }, {
          meta: {
            'concept-id': 'VIS100000-EDSC',
            'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            'revision-id': 2
          },
          umm: {
            LongName: 'Adipiscing Cras Etiam Venenatis'
          }
        }]
      })

    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .put('/ingest/providers/EDSC/visualizations/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
      .reply(200, {
        'concept-id': 'VIS100000-EDSC',
        'revision-id': '3'
      })

    const response = await visualizationSourceRestoreRevision({
      revisionId: '1',
      conceptId: 'VIS100000-EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'VIS100000-EDSC',
      revisionId: '3'
    })
  })
})

describe('visualization#delete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'deleteVisualization',
      alias: 'deleteVisualization',
      args: {
        conceptId: 'VIS100000-EDSC',
        nativeId: 'test-guid'
      },
      fieldsByTypeName: {
        VisualizationMutationResponse: {
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
      .delete(/ingest\/providers\/EDSC\/visualizations\/test-guid/)
      .reply(201, {
        'concept-id': 'VIS100000-EDSC',
        'revision-id': '2'
      })

    const response = await visualizationSourceDelete({
      nativeId: 'test-guid',
      providerId: 'EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'VIS100000-EDSC',
      revisionId: '2'
    })
  })

  test('catches errors received from cmrDelete', async () => {
    nock(/example-cmr/)
      .delete(/ingest\/providers\/EDSC\/visualizations\/test-guid/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      visualizationSourceDelete({
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
