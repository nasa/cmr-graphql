import nock from 'nock'

import serviceDatasource from '../service'

let requestInfo

describe('service', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

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
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-98726357'
        })
        .post(/services\.umm_json/)
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

      const response = await serviceDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
        items: [{
          conceptId: 'S100000-EDSC',
          type: 'OPeNDAP'
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
          .post(/services\.umm_json/, 'scroll=true')
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

        const response = await serviceDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
          items: [{
            conceptId: 'S100000-EDSC',
            type: 'OPeNDAP'
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
          .post(/services\.json/, 'scroll=true')
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
          .post(/services\.umm_json/, 'scroll=true')
          .reply(200, {
            items: []
          })

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-29834750' })
          .reply(204)

        nock(/example/)
          .post('/search/clear-scroll', { scroll_id: '-98726357' })
          .reply(204)

        const response = await serviceDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

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
          .post(/services\.json/, 'scroll=true')
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
          .post(/services\.umm_json/, 'scroll=true')
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
          serviceDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')
        ).rejects.toThrow(Error)
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed service results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/)
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        })

      const response = await serviceDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'S100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed service results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/, 'concept_id=S100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        })

      const response = await serviceDatasource({ params: { concept_id: 'S100000-EDSC' } }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'S100000-EDSC'
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
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
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.umm_json/)
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

      const response = await serviceDatasource({ params: { concept_id: 'S100000-EDSC' } }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          type: 'OPeNDAP'
        }]
      })
    })
  })

  test('catches errors received from queryCmrServices', async () => {
    nock(/example/)
      .post(/services/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      serviceDatasource({ params: { conceptId: 'S100000-EDSC' } }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')
    ).rejects.toThrow(Error)
  })
})
