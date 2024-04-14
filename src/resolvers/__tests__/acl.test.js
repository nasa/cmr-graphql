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
              concept_id: 'ACL100000-EDSC',
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
          query GetAcls($params: AclsInput) {
            acls(params: $params) {
              items {
                catalogItemIdentity
                conceptId
                groupPermissions
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

      const { data, errors } = response.body.singleResult

      expect(errors).toBeUndefined()
      expect(data).toEqual({
        acls: {
          items: [{
            catalogItemIdentity: {
              name: 'Mock test',
              provider_id: 'TEST_123',
              collection_applicable: true,
              granule_applicable: true
            },
            conceptId: 'ACL100000-EDSC',
            groupPermissions: [
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
            identityType: 'Catalog Item',
            location: 'Mock Location',
            name: 'Mock Test Name',
            revisionId: 1
          }]
        }
      })
    })

    describe('acls', () => {
      test('returns results', async () => {
        // TODO: 'page_size=2&include_full_acl=true'
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/access-control\/acls/)
          .reply(200, {
            items: [{
              concept_id: 'ACL100000-EDSC'
            }, {
              concept_id: 'ACL100004-EDSC'
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            acls(params: {limit:2}) {
              items {
                conceptId
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
              conceptId: 'ACL100000-EDSC'
            }, {
              conceptId: 'ACL100004-EDSC'
            }]
          }
        })
      })
    })

    describe('acl', () => {
      describe('with results', () => {
        test('returns results', async () => {
          // TODO 'id=ACL100000-EDSC&include_full_acl=true'
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/access-control\/acls/)
            .reply(200, {
              items: [{
                concept_id: 'ACL100000-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {
              conceptId: 'ACL100000-EDSC'
            },
            query: `query Acl($conceptId: String) {
              acl(conceptId: $conceptId) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()
          expect(data).toEqual({
            acl: {
              conceptId: 'ACL100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/access-control\/acls/)
            .reply(200, {
              feed: {
                entry: []
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              acl(conceptId: "ACL100000-EDSC") {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            acl: null
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('createAcl', () => {
      test('returns the cmr result', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/access-control\/acls/, {
            catalog_item_identity: {
              name: 'All Granules',
              provider_id: 'EDSC',
              granule_applicable: true
            },
            group_permissions: [{
              group_id: 'AG1234-EDSC',
              permissions: ['read', 'order']
            }, {
              user_type: 'guest',
              permissions: ['read']
            }]
          })
          .reply(201, {
            concept_id: 'ACL100000-EDSC',
            revision_id: '1'
          })

        const response = await server.executeOperation({
          variables: {
            groupPermissions: [{
              group_id: 'AG1234-EDSC',
              permissions: ['read', 'order']
            }, {
              user_type: 'guest',
              permissions: ['read']
            }],
            catalogItemIdentity: {
              name: 'All Granules',
              provider_id: 'EDSC',
              granule_applicable: true
            }
          },
          query: `mutation CreateAcl(
            $groupPermissions: JSON!
            $catalogItemIdentity: JSON!
          ) {
            createAcl(
              groupPermissions: $groupPermissions
              catalogItemIdentity: $catalogItemIdentity
            ) {
              conceptId
              revisionId
            }
          }`
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()
        expect(data).toEqual({
          createAcl: {
            conceptId: 'ACL100000-EDSC',
            revisionId: '1'
          }
        })
      })
    })

    describe('updateAcl', () => {
      test('returns the cmr result', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .put(/access-control\/acls\/ACL100000-EDSC/, {
            catalog_item_identity: {
              name: 'All Granules',
              provider_id: 'EDSC',
              granule_applicable: true
            },
            group_permissions: [{
              group_id: 'AG1234-EDSC',
              permissions: ['read', 'order']
            }, {
              user_type: 'guest',
              permissions: ['read']
            }]
          })
          .reply(201, {
            concept_id: 'ACL100000-EDSC',
            revision_id: '1'
          })

        const response = await server.executeOperation({
          variables: {
            conceptId: 'ACL100000-EDSC',
            groupPermissions: [{
              group_id: 'AG1234-EDSC',
              permissions: ['read', 'order']
            }, {
              user_type: 'guest',
              permissions: ['read']
            }],
            catalogItemIdentity: {
              name: 'All Granules',
              provider_id: 'EDSC',
              granule_applicable: true
            }
          },
          query: `mutation UpdateAcl(
            $catalogItemIdentity: JSON!
            $conceptId: String!
            $groupPermissions: JSON!
          ) {
            updateAcl(
              catalogItemIdentity: $catalogItemIdentity
              conceptId: $conceptId
              groupPermissions: $groupPermissions
            ) {
              conceptId
              revisionId
            }
          }`
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()
        expect(data).toEqual({
          updateAcl: {
            conceptId: 'ACL100000-EDSC',
            revisionId: '1'
          }
        })
      })
    })

    describe('deleteAcl', () => {
      test('returns the cmr result', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .delete(/access-control\/acls\/ACL100000-EDSC/)
          .reply(201, {
            'concept-id': 'ACL100000-EDSC',
            'revision-id': '2'
          })

        const response = await server.executeOperation({
          variables: {
            conceptId: 'ACL100000-EDSC'
          },
          query: `mutation DeleteAcl(
            $conceptId: String!
          ) {
            deleteAcl(
              conceptId: $conceptId
            ) {
              conceptId
              revisionId
            }
          }`
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          deleteAcl: {
            conceptId: 'ACL100000-EDSC',
            revisionId: '2'
          }
        })
      })
    })
  })
})
