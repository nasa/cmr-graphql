import nock from 'nock'

import toolDatasource from '../tool'

let requestInfo

describe('tool', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'tools',
      alias: 'tools',
      args: {},
      fieldsByTypeName: {
        ToolList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Tool: {
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
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
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
                Tool: {
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
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-98726357'
        })
        .post(/tools\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC'
            },
            umm: {
              Type: 'Downloadable Tool'
            }
          }]
        })

      const response = await toolDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
        items: [{
          conceptId: 'T100000-EDSC',
          type: 'Downloadable Tool'
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
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/tools\.umm_json/, 'scroll=true')
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'T100000-EDSC'
              },
              umm: {
                Type: 'Downloadable Tool'
              }
            }]
          })

        const response = await toolDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
          items: [{
            conceptId: 'T100000-EDSC',
            type: 'Downloadable Tool'
          }]
        })
      })
    })

    describe('when a cursor returns no results', () => {
      test('calls CMR to clear the scroll session', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 0,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-29834750'
          })
          .post(/tools\.json/, 'scroll=true')
          .reply(200, {
            feed: {
              entry: []
            }
          })

        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 0,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/tools\.umm_json/, 'scroll=true')
          .reply(200, {
            items: []
          })

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-29834750' })
          .reply(204)

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-98726357' })
          .reply(204)

        const response = await toolDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

        expect(response).toEqual({
          count: 0,
          cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
          items: []
        })
      })

      test('catches errors received from CMR', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 0,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-29834750'
          })
          .post(/tools\.json/, 'scroll=true')
          .reply(200, {
            feed: {
              entry: []
            }
          })

        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 0,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/tools\.umm_json/, 'scroll=true')
          .reply(200, {
            items: []
          })

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-29834750' })
          .reply(500)

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-98726357' })
          .reply(500)


        await expect(
          toolDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')
        ).rejects.toThrow(Error)
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed tool results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tools\.json/)
        .reply(200, {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        })

      const response = await toolDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'T100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed tool results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tools\.json/, 'concept_id=T100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        })

      const response = await toolDatasource({ concept_id: 'T100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'T100000-EDSC'
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
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
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
                  type: {
                    name: 'type',
                    alias: 'type',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  toolKeywords: {
                    name: 'toolKeywords',
                    alias: 'toolKeywords',
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

    test('returns the parsed tool results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tools\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC'
            },
            umm: {
              Type: 'Downloadable Tool'
            }
          }]
        })

      const response = await toolDatasource({ concept_id: 'T100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          type: 'Downloadable Tool'
        }]
      })
    })
  })

  test('catches errors received from queryCmrTools', async () => {
    nock(/example/)
      .post(/tools/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      toolDatasource({ conceptId: 'T100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')
    ).rejects.toThrow(Error)
  })
})
