import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Group', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.ursRootUrl = 'http://example-urs.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('groups', () => {
      describe('when searching for user groups', () => {
        test('returns the matching user groups', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'X-Request-Id': 'abcd-1234-efgh-5678'
            }
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
            query: `query Groups (
              $params: GroupsInput
            ) {
              groups (
                params: $params
              ) {
                count
                items {
                  id
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
            groups: {
              count: 1,
              items: [{
                id: '90336eb8-309c-44f5-aaa8-1672765b1195',
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

    describe('group', () => {
      describe('when requesting a single user group', () => {
        test('returns the user group', async () => {
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
            variables: {
              params: {
                id: '90336eb8-309c-44f5-aaa8-1672765b1195'
              }
            },
            query: `query Group (
              $params: GroupInput
            ) {
              group (
                params: $params
              ) {
                id
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
            group: {
              id: '90336eb8-309c-44f5-aaa8-1672765b1195',
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
    describe('createGroup', () => {
      describe('when creating a new user group', () => {
        test('returns the user group', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'X-Request-Id': 'abcd-1234-efgh-5678'
            }
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
            query: `mutation CreateGroup (
              $name: String!
              $tag: String
              $description: String
            ) {
              createGroup (
                name: $name
                tag: $tag
                description: $description
              ) {
                id
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
            createGroup: {
              id: '90336eb8-309c-44f5-aaa8-1672765b1195',
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

    describe('deleteGroup', () => {
      describe('when deleting a user group', () => {
        test('returns the updated user group', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'X-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .delete(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195/)
            .reply(200)

          const response = await server.executeOperation({
            variables: {
              id: '90336eb8-309c-44f5-aaa8-1672765b1195'
            },
            query: `mutation DeleteGroup (
              $id: String!
            ) {
              deleteGroup (
                id: $id
              )
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            deleteGroup: true
          })
        })
      })
    })

    describe('updateGroup', () => {
      describe('when updating a user group', () => {
        test('returns true', async () => {
          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'X-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .post(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195\/update/)
            .reply(200, {
              description: 'Successfully updated user group Test Group'
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
              name: 'Test Group - Updated',
              description: 'Just a test group',
              shared_user_group: false,
              created_by: 'mmt_test',
              tag: 'MMT_2'
            })

          const response = await server.executeOperation({
            variables: {
              id: '90336eb8-309c-44f5-aaa8-1672765b1195',
              name: 'Test Group - Updated'
            },
            query: `mutation UpdateGroup (
              $id: String!
              $name: String
            ) {
              updateGroup (
                id: $id
                name: $name
              ) {
                id
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
            updateGroup: {
              id: '90336eb8-309c-44f5-aaa8-1672765b1195',
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

  describe('Group', () => {
    describe('members', () => {
      describe('when request group members', () => {
        test('returns a list of members', async () => {
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

          nock(/example-urs/, {
            reqheaders: {
              'Client-Id': 'eed-test-graphql',
              'X-Request-Id': 'abcd-1234-efgh-5678'
            }
          })
            .get(/api\/user_groups\/group_members\/90336eb8-309c-44f5-aaa8-1672765b1195/)
            .reply(200, {
              users: [{
                email_address: 'testuser@example.com',
                first_name: 'test',
                last_name: 'user',
                uid: 'testuser'
              }]
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                id: '90336eb8-309c-44f5-aaa8-1672765b1195'
              }
            },
            query: `query Group (
              $params: GroupInput
            ) {
              group (
                params: $params
              ) {
                members {
                  count
                  items {
                    id
                    firstName
                    lastName
                    emailAddress
                  }
                }
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            group: {
              members: {
                count: 1,
                items: [{
                  emailAddress: 'testuser@example.com',
                  firstName: 'test',
                  lastName: 'user',
                  id: 'testuser'
                }]
              }
            }
          })
        })
      })
    })
  })
})
