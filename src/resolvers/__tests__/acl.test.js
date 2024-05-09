import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Acl', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    process.env.ursRootUrl = 'http://example-urs.com'
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
                groupPermissions {
                  count
                  items {
                    permissions
                    userType
                    group {
                      id
                      name
                    }
                  }
                }
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
            groupPermissions: {
              count: 2,
              items: [{
                permissions: [
                  'read'
                ],
                userType: 'guest',
                group: null
              },
              {
                permissions: [
                  'read'
                ],
                userType: 'registered',
                group: null
              }]
            },
            identityType: 'Catalog Item',
            location: 'Mock Location',
            name: 'Mock Test Name',
            revisionId: 1
          }]
        }
      })
    })

    describe('Query group permission', () => {
      test('return group permission result', async () => {
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
                      group_id: '90336eb8-309c-44f5-aaa8-1672765b1195'
                    }
                  ]
                }
              }
            ]
          })

        nock(/example-urs/, {
          reqheaders: {
            'Client-Id': 'eed-test-graphql',
            'X-Request-Id': 'abcd-1234-efgh-5678'
          }
        })
          .get(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195/)
          .reply(200, {
            group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
            app_uid: 'mmt_test',
            client_id: '81FEem91NlTQreWv2UgtXQ',
            name: 'Test Group',
            description: 'Just a test group',
            shared_user_group: false,
            created_by: 'mmt_test',
            tag: 'MMT_2'
          })

        const response = await server.executeOperation({
          variables: {},
          query: `
              query GetAcls($params: AclsInput) {
                acls(params: $params) {
                  items {
                    catalogItemIdentity
                    conceptId
                    groupPermissions {
                      count
                      items {
                        permissions
                        userType
                        group {
                          id
                          name
                        }
                      }
                    }
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
              catalogItemIdentity: null,
              conceptId: 'ACL100000-EDSC',
              groupPermissions: {
                count: 1,
                items: [{
                  permissions: ['read'],
                  userType: null,
                  group: {
                    id: '90336eb8-309c-44f5-aaa8-1672765b1195',
                    name: 'Test Group'
                  }
                }]
              },
              identityType: 'Catalog Item',
              location: 'Mock Location',
              name: 'Mock Test Name',
              revisionId: 1
            }]
          }
        })
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
