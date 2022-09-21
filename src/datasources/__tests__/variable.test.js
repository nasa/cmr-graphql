import nock from 'nock'

import variableDatasource from '../variable'

let requestInfo

describe('variable', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'variables',
      alias: 'variables',
      args: {},
      fieldsByTypeName: {
        VariableList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Variable: {
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
        name: 'variables',
        alias: 'variables',
        args: {},
        fieldsByTypeName: {
          VariableList: {
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
                Variable: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  variableType: {
                    name: 'variableType',
                    alias: 'variableType',
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
        .post(/variables\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'V100000-EDSC'
            },
            umm: {
              VariableType: 'SCIENCE_VARIABLE'
            }
          }]
        })

      const response = await variableDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
        items: [{
          conceptId: 'V100000-EDSC',
          variableType: 'SCIENCE_VARIABLE'
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
          .post(/variables\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'V100000-EDSC'
              },
              umm: {
                VariableType: 'SCIENCE_VARIABLE'
              }
            }]
          })

        const response = await variableDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'V100000-EDSC',
            variableType: 'SCIENCE_VARIABLE'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed variable results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/)
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }]
        })

      const response = await variableDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'V100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed variable results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'concept_id=V100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }]
        })

      const response = await variableDatasource({ params: { concept_id: 'V100000-EDSC' } }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'V100000-EDSC'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'variables',
        alias: 'variables',
        args: {},
        fieldsByTypeName: {
          VariableList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Variable: {
                  variableType: {
                    name: 'variableType',
                    alias: 'variableType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  scienceKeywords: {
                    name: 'scienceKeywords',
                    alias: 'scienceKeywords',
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

    test('returns the parsed variable results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'V100000-EDSC'
            },
            umm: {
              VariableType: 'SCIENCE_VARIABLE'
            }
          }]
        })

      const response = await variableDatasource({ params: { conceptId: 'V100000-EDSC' } }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          variableType: 'SCIENCE_VARIABLE'
        }]
      })
    })
  })

  test('catches errors received from queryCmrVariables', async () => {
    nock(/example/)
      .post(/variables/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      variableDatasource({ params: { conceptId: 'V100000-EDSC' } }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')
    ).rejects.toThrow(Error)
  })
})
