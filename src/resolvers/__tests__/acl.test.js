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
        .get(/access-control\/acls/)
        .reply(200, {
          items: [
            {
              concept_id: 'Mock Concept ID',
              revision_id: 1,
              identity_type: 'Catalog Item',
              name: 'Mock Test Name',
              location: 'Mock Location',
              acl: {
                group_permissions: [
                  {
                    permissions: [
                      'read'
                    ],
                    user_type: 'guest'
                  },
                  {
                    permissions: [
                      'read'
                    ],
                    user_type: 'registered'
                  }
                ],
                catalog_item_identity: {
                  name: 'Mock test',
                  provider_id: 'TEST_123',
                  collection_applicable: true,
                  granule_applicable: true
                }
              }
            }
          ]

        })

      const response = await server.executeOperation({
        variables: {},
        query: `
          query Acls($params: AclsInput) {
            acls(params: $params) {
              items {
                conceptId
                revisionId
                identityType
                name
                location
                acl
              }
            }
          }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        acls: {
          items: [{
            conceptId: 'Mock Concept ID',
            revisionId: 1,
            identityType: 'Catalog Item',
            name: 'Mock Test Name',
            location: 'Mock Location',
            acl: {
              group_permissions: [
                {
                  permissions: [
                    'read'
                  ],
                  user_type: 'guest'
                },
                {
                  permissions: [
                    'read'
                  ],
                  user_type: 'registered'
                }
              ],
              catalog_item_identity: {
                name: 'Mock test',
                provider_id: 'TEST_123',
                collection_applicable: true,
                granule_applicable: true
              }
            }
          }]
        }
      })
    })
  })
})
