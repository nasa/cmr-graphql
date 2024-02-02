import nock from 'nock'

import aclSource from '../acl'

let requestInfo

describe('acls', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'acls',
      alias: 'acls',
      args: {},
      fieldsByTypeName: {
        AclList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
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
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('cursor', () => {
    beforeEach(() => {
    // Overwrite default requestInfo
      requestInfo = {
        name: 'acls',
        alias: 'acls',
        args: {},
        fieldsByTypeName: {
          AclList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {
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
    })

    test('returns a cursor', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 24,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Search-After': '["xyz", 789, 999]'
        })
        .get(/acls/)
        .reply(200, {
          items: [{
            concept_id: 'Mock Concept id'
          }]
        })

      const response = await aclSource({
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 24,
        cursor: 'eyJqc29uIjoiW1wieHl6XCIsIDc4OSwgOTk5XSJ9',
        items: [{
          conceptId: 'Mock Concept id'
        }]
      })
    })

    describe('when a cursor is requested', () => {
      test('requests a cursor', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 24,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Search-After': '["xyz", 789, 999]'
        })
        .get(/acls/)
        .reply(200, {
          items: [{
            concept_id: 'Mock Concept id'
          }]
        })
  
      const response = await aclSource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
  
      expect(response).toEqual({
        count: 24,
        cursor: 'eyJqc29uIjoiW1wieHl6XCIsIDc4OSwgOTk5XSJ9',
        items: [{
          conceptId: 'Mock Concept id'
        }]
      })
      
      })
    }) 
  }) 
})
