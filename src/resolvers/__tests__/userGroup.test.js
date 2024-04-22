import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Association', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.ursRootUrl = 'http://example-urs.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('userGroups', () => {
      describe('when searching for user groups', () => {
        test('returns the matching user groups', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7
            })
            .get(/api\/user_groups\/search/)
            .reply(200, [{
              group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
              app_uid: 'mmt_test',
              client_id: '81FEem91NlTQreWv2UgtXQ',
              name: 'Test Group',
              description: 'Just a test group',
              shared_user_group: false,
              created_by: 'mmt_test',
              tag: 'MMT_2'
            }])

          const response = await server.executeOperation({
            variables: {
              params: {
                tags: ['MMT_2'],
                name: 'Test'
              }
            },
            query: `query UserGroups (
              $params: UserGroupsInput
            ) {
              userGroups (
                params: $params
              ) {
                count
                items {
                  groupId
                  appUid
                  clientId
                  name
                  description
                  sharedUserGroup
                  createdBy
                  tag
                }
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            userGroups: {
              count: 1,
              items: [{
                groupId: '90336eb8-309c-44f5-aaa8-1672765b1195',
                appUid: 'mmt_test',
                clientId: '81FEem91NlTQreWv2UgtXQ',
                name: 'Test Group',
                description: 'Just a test group',
                sharedUserGroup: false,
                createdBy: 'mmt_test',
                tag: 'MMT_2'
              }]
            }
          })
        })
      })
    })

    describe('userGroup', () => {
      describe('when requesting a single user group', () => {
        test('returns the user group', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7
            })
            .get(/api\/user_groups\/Test\?tag=MMT_2/)
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
            variables: {
              params: {
                tag: 'MMT_2',
                userGroupIdOrName: 'Test'
              }
            },
            query: `query UserGroup (
              $params: UserGroupInput
            ) {
              userGroup (
                params: $params
              ) {
                groupId
                appUid
                clientId
                name
                description
                sharedUserGroup
                createdBy
                tag
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult
          console.log('🚀 ~ test ~ errors:', errors)

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            userGroup: {
              groupId: '90336eb8-309c-44f5-aaa8-1672765b1195',
              appUid: 'mmt_test',
              clientId: '81FEem91NlTQreWv2UgtXQ',
              name: 'Test Group',
              description: 'Just a test group',
              sharedUserGroup: false,
              createdBy: 'mmt_test',
              tag: 'MMT_2'
            }
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('createUserGroup', () => {
      describe('when creating a new user group', () => {
        test('returns the user group', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7
            })
            .post(/api\/user_groups/)
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
            variables: {
              name: 'Test Group',
              tag: 'MMT_2',
              description: 'Just a test group'
            },
            query: `mutation CreateUserGroup (
              $name: String!
              $tag: String
              $description: String
            ) {
              createUserGroup (
                name: $name
                tag: $tag
                description: $description
              ) {
                groupId
                appUid
                clientId
                name
                description
                sharedUserGroup
                createdBy
                tag
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createUserGroup: {
              groupId: '90336eb8-309c-44f5-aaa8-1672765b1195',
              appUid: 'mmt_test',
              clientId: '81FEem91NlTQreWv2UgtXQ',
              name: 'Test Group',
              description: 'Just a test group',
              sharedUserGroup: false,
              createdBy: 'mmt_test',
              tag: 'MMT_2'
            }
          })
        })
      })
    })

    describe('deleteUserGroup', () => {
      describe('when deleting a user group', () => {
        test('returns the updated user group', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7
            })
            .delete(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195/)
            .reply(200)

          const response = await server.executeOperation({
            variables: {
              id: '90336eb8-309c-44f5-aaa8-1672765b1195'
            },
            query: `mutation DeleteUserGroup (
              $id: String!
            ) {
              deleteUserGroup (
                id: $id
              )
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            deleteUserGroup: true
          })
        })
      })
    })

    describe('updateUserGroup', () => {
      describe('when updating a user group', () => {
        test('returns true', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7
            })
            .post(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195\/update/)
            .reply(200, {
              description: 'Successfully updated user group Test Group'
            })

          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7
            })
            .get(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195/)
            .reply(200, {
              group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
              app_uid: 'mmt_test',
              client_id: '81FEem91NlTQreWv2UgtXQ',
              name: 'Test Group - Updated',
              description: 'Just a test group',
              shared_user_group: false,
              created_by: 'mmt_test',
              tag: 'MMT_2'
            })

          const response = await server.executeOperation({
            variables: {
              userGroupIdOrName: '90336eb8-309c-44f5-aaa8-1672765b1195',
              name: 'Test Group - Updated'
            },
            query: `mutation UpdateUserGroup (
              $userGroupIdOrName: String!
              $name: String
            ) {
              updateUserGroup (
                userGroupIdOrName: $userGroupIdOrName
                name: $name
              ) {
                groupId
                appUid
                clientId
                name
                description
                sharedUserGroup
                createdBy
                tag
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            updateUserGroup: {
              groupId: '90336eb8-309c-44f5-aaa8-1672765b1195',
              appUid: 'mmt_test',
              clientId: '81FEem91NlTQreWv2UgtXQ',
              name: 'Test Group - Updated',
              description: 'Just a test group',
              sharedUserGroup: false,
              createdBy: 'mmt_test',
              tag: 'MMT_2'
            }
          })
        })
      })
    })
  })
})
