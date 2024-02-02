import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Acl', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('acl fields', async () => {
        nock(/example-cmr/)
        .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/acls/)
        .reply(200, {
            items: [{ 
                  conceptId: 'example-provider-id',
                }
            ]
        })

        const response = await server.executeOperation({
            variables: {},
            query: `{
                acls(params: { includeFullAcl: true }){
                  count
                  items {
                    acl
                    conceptId
                    identityType
                    location
                    name
                    revisionId
                  }
                }
              }`
        }, {
            contextValue
        })

        const { data } = response.body.singleResult
        console.log('@@@ response', response)

        // expect(data).toEqual({
        //     items: [
        //         {
        //           acls: {
        //             items: {
        //                 name: 'example-provider-id'
        //             }
        //           }
        //         }
        //     ]
        //   })
    })
  })
})
