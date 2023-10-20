import nock from 'nock'

import dataQualitySummarySource from '../dataQualitySummary'

let requestInfo

describe('dataQualitySummary', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'dqs',
      alias: 'dqs',
      args: {},
      fieldsByTypeName: {
        DataQualitySummaryList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              DataQualitySummary: {
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
        name: 'dataQualitySummaries',
        alias: 'dataQualitySummaries',
        args: {},
        fieldsByTypeName: {
          DataQualitySummaryList: {
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
                DataQualitySummary: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  summary: {
                    name: 'summary',
                    alias: 'summary',
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
        .post(/data-quality-summaries\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'DQS100000-EDSC'
            },
            umm: {
              Summary: 'summary'
            }
          }]
        })

      const response = await dataQualitySummarySource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
        items: [{
          conceptId: 'DQS100000-EDSC',
          summary: 'summary'
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
          .post(/data-quality-summaries\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'DQS100000-EDSC'
              },
              umm: {
                Summary: 'summary'
              }
            }]
          })

        const response = await dataQualitySummarySource({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'DQS100000-EDSC',
            summary: 'summary'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed data-quality-summary results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/data-quality-summaries\.json/)
        .reply(200, {
          items: [{
            concept_id: 'DQS100000-EDSC'
          }]
        })

      const response = await dataQualitySummarySource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'DQS100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed dataQuality summary results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/data-quality-summaries\.json/, 'concept_id=DQS100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'DQS100000-EDSC'
          }]
        })

      const response = await dataQualitySummarySource({
        params: {
          concept_id: 'DQS100000-EDSC'
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
          conceptId: 'DQS100000-EDSC'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'dataQualitySummaries',
        alias: 'dataQualitySummaries',
        args: {},
        fieldsByTypeName: {
          DataQualitySummaryList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                DataQualitySummary: {
                  summary: {
                    name: 'summary',
                    alias: 'summary',
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

    test('returns the parsed dataQualitySummary results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/data-quality-summaries\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'DQS100000-EDSC'
            },
            umm: {
              Summary: 'summary'
            }
          }]
        })

      const response = await dataQualitySummarySource({
        params: {
          concept_id: 'DQS100000-EDSC'
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
          summary: 'summary'
        }]
      })
    })
  })

  test('catches errors received from querying CMR for dataQualitySummaries', async () => {
    nock(/example-cmr/)
      .post(/data-quality-summaries/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      dataQualitySummarySource({
        params: {
          conceptId: 'DQS100000-EDSC'
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
