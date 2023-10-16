import nock from 'nock'

jest.mock('uuid', () => ({ v4: () => '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' }))

import {
  deleteDraft as draftSourceDelete,
  fetchDrafts as draftSourceFetch,
  ingestDraft as draftSourceIngest
} from '../draft'

let requestInfo

describe('draft#fetch', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'drafts',
      alias: 'drafts',
      args: {},
      fieldsByTypeName: {
        DraftList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Draft: {
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
        name: 'drafts',
        alias: 'drafts',
        args: {},
        fieldsByTypeName: {
          DraftList: {
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
                Draft: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
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
        .post(/tool-drafts\.json/)
        .reply(200, {
          items: [{
            concept_id: 'TD100000-EDSC',
            name: 'Mock Name'
          }]
        })

      const response = await draftSourceFetch({
        params: {
          conceptType: 'Tool'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJqc29uIjoiW1wieHl6XCIsIDc4OSwgOTk5XSJ9',
        items: [{
          conceptId: 'TD100000-EDSC',
          name: 'Mock Name'
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
          .post(/tool-drafts\.json/)
          .reply(200, {
            items: [{
              concept_id: 'TD100000-EDSC',
              name: 'Mock Name'
            }]
          })

        const response = await draftSourceFetch({
          params: {
            conceptType: 'Tool'
          }
        }, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJqc29uIjoiW1wieHl6XCIsIDc4OSwgOTk5XSJ9',
          items: [{
            conceptId: 'TD100000-EDSC',
            name: 'Mock Name'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed draft results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tool-drafts\.json/)
        .reply(200, {
          items: [{
            concept_id: 'TD100000-EDSC'
          }]
        })

      const response = await draftSourceFetch({
        params: {
          conceptType: 'Tool'
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
          conceptId: 'TD100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed draft results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tool-drafts\.json/, 'concept_id=TD100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'TD100000-EDSC'
          }]
        })

      const response = await draftSourceFetch({
        params: {
          conceptType: 'Tool',
          conceptId: 'TD100000-EDSC'
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
          conceptId: 'TD100000-EDSC'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'drafts', // TODO What is this supposed to be?
        alias: 'drafts',
        args: {},
        fieldsByTypeName: {
          DraftList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Draft: {
                  deleted: {
                    name: 'deleted',
                    alias: 'deleted',
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

    test('returns the parsed draft results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/drafts\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'TD100000-EDSC',
              deleted: false
            },
            umm: {}
          }]
        })

      const response = await draftSourceFetch({
        params: {
          conceptId: 'TD100000-EDSC',
          conceptType: 'Tool'
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
          deleted: false
        }]
      })
    })
  })

  test('catches errors received from queryCmrDrafts', async () => {
    nock(/example/)
      .post(/drafts/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      draftSourceFetch({
        params: {
          conceptId: 'TD100000-EDSC'
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

describe('draft#ingest', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'createDraft',
      alias: 'createDraft',
      args: {
        collectionConceptId: 'C100000-EDSC',
        name: 'Test Draft',
        query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
        subscriberId: 'testuser'
      },
      fieldsByTypeName: {
        DraftMutationResponse: {
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

  test('returns the parsed draft results', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .put(/ingest\/providers\/EDSC\/tool-drafts\/test-guid/)
      .reply(201, {
        'concept-id': 'TD100000-EDSC',
        'revision-id': '1'
      })

    const response = await draftSourceIngest({
      conceptType: 'Tool',
      metadata: {},
      nativeId: 'test-guid',
      providerId: 'EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'TD100000-EDSC',
      revisionId: '1'
    })
  })

  test('catches errors received from ingestCmr', async () => {
    nock(/example/)
      .put(/ingest\/providers\/EDSC\/tool-drafts\/test-guid/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      draftSourceIngest({
        conceptType: 'Tool',
        metadata: {},
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

describe('draft#delete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'deleteDraft',
      alias: 'deleteDraft',
      args: {
        conceptId: 'TD100000-EDSC',
        nativeId: 'test-guid'
      },
      fieldsByTypeName: {
        DraftMutationResponse: {
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

  test('returns the parsed draft results', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .delete(/ingest\/providers\/EDSC\/tool-drafts\/test-guid/)
      .reply(201, {
        'concept-id': 'TD100000-EDSC',
        'revision-id': '1'
      })

    const response = await draftSourceDelete({
      conceptType: 'Tool',
      nativeId: 'test-guid',
      providerId: 'EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'TD100000-EDSC',
      revisionId: '1'
    })
  })

  test('catches errors received from cmrDelete', async () => {
    nock(/example/)
      .delete(/ingest\/providers\/EDSC\/tool-drafts\/test-guid/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      draftSourceDelete({
        conceptType: 'Tool',
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
