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
  })

  console.log('@@@', requestInfo)

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
              fieldsByTypeName: {}
            },
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                // Acl: {
                //   conceptId: {
                //     name: 'conceptId',
                //     alias: 'conceptId',
                //     args: {},
                //     fieldsByTypeName: {}
                //   },
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
    })

    test('returns a cursor', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 24,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Search-After': '["xyz", 789, 999]'
        })
        .get(/acls\.umm_json/)
        .reply(200, {
          items: [{
            name: 'Mock Name'
          }]
        })

      const response = await aclSource({
        params: {
        cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0='
      }}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      console.log('@@response', response)
      // expect(response).toEqual({
      //   count: 24,
      //   cursor: 'eyJqc29uIjoiLTI5ODM0NzUwIiwidW1tIjoiLTk4NzI2MzU3In0=',
      //   items: [{
      //     name: 'Mock Name'
      //   }]
      // })
    })

    
  })
})
