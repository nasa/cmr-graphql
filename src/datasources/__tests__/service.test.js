import nock from 'nock'

import {
  deleteService as serviceSourceDelete,
  restoreServiceRevision as serviceSourceRestoreRevision,
  fetchServices as serviceSourceFetch
} from '../service'

let requestInfo

describe('service', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'services',
      alias: 'services',
      args: {},
      fieldsByTypeName: {
        ServiceList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Service: {
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
        name: 'services',
        alias: 'services',
        args: {},
        fieldsByTypeName: {
          ServiceList: {
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
                Service: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  type: {
                    name: 'type',
                    alias: 'type',
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
        .get(/services\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC'
            },
            umm: {
              Type: 'OPeNDAP'
            }
          }]
        })

      const response = await serviceSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
        items: [{
          conceptId: 'S100000-EDSC',
          type: 'OPeNDAP'
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
          .get(/services\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'S100000-EDSC'
              },
              umm: {
                Type: 'OPeNDAP'
              }
            }]
          })

        const response = await serviceSourceFetch({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'S100000-EDSC',
            type: 'OPeNDAP'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed service results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/services\.json/)
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        })

      const response = await serviceSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'S100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed service results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/services.json?concept_id=S100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        })

      const response = await serviceSourceFetch({
        params: {
          concept_id: 'S100000-EDSC'
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
          conceptId: 'S100000-EDSC'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'services',
        alias: 'services',
        args: {},
        fieldsByTypeName: {
          ServiceList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Service: {
                  type: {
                    name: 'type',
                    alias: 'type',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  serviceOptions: {
                    name: 'serviceOptions',
                    alias: 'serviceOptions',
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

    test('returns the parsed service results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/services\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC'
            },
            umm: {
              Type: 'OPeNDAP'
            }
          }]
        })

      const response = await serviceSourceFetch({
        params: {
          concept_id: 'S100000-EDSC'
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
          type: 'OPeNDAP'
        }]
      })
    })
  })

  test('catches errors received from queryCmrServices', async () => {
    nock(/example-cmr/)
      .get(/services/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      serviceSourceFetch({
        params: {
          conceptId: 'S100000-EDSC'
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

describe('restoreServiceRevision', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'toolDelete',
      alias: 'toolDelete',
      args: {
        conceptId: 'S100000-EDSC',
        revisionId: '1'
      },
      fieldsByTypeName: {
        ServiceMutationResponse: {
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
      .get('/search/services.umm_json?concept_id=S100000-EDSC&all_revisions=true')
      .reply(200, {
        items: [{
          meta: {
            'concept-id': 'S100000-EDSC',
            'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            'revision-id': 1
          },
          umm: {
            LongName: 'Tortor Elit Fusce Quam Risus'
          }
        }, {
          meta: {
            'concept-id': 'S100000-EDSC',
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
      .put('/ingest/providers/EDSC/services/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
      .reply(200, {
        'concept-id': 'S100000-EDSC',
        'revision-id': '3'
      })

    const response = await serviceSourceRestoreRevision({
      revisionId: '1',
      conceptId: 'S100000-EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'S100000-EDSC',
      revisionId: '3'
    })
  })
})

describe('subscription#delete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'deleteService',
      alias: 'deleteService',
      args: {
        conceptId: 'S100000-EDSC',
        nativeId: 'test-guid'
      },
      fieldsByTypeName: {
        ServiceMutationResponse: {
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
      .delete(/ingest\/providers\/EDSC\/services\/test-guid/)
      .reply(201, {
        'concept-id': 'S100000-EDSC',
        'revision-id': '1'
      })

    const response = await serviceSourceDelete({
      nativeId: 'test-guid',
      providerId: 'EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'S100000-EDSC',
      revisionId: '1'
    })
  })

  test('catches errors received from cmrDelete', async () => {
    nock(/example-cmr/)
      .delete(/ingest\/providers\/EDSC\/services\/test-guid/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      serviceSourceDelete({
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
