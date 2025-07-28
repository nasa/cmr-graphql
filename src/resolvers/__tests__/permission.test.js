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
    describe('permissions', () => {
      describe('for a single concept id', () => {
        test('permissions', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 1,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/access-control\/permissions/)
            .reply(200, {
              'C100000-EDSC': ['read', 'delete']
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                conceptId: 'C100000-EDSC'
              }
            },
            query: `
              query GetPermissions($params: PermissionsInput) {
                permissions(params: $params) {
                  items {
                    conceptId
                    permissions
                  }
                }
              }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()
          expect(data).toEqual({
            permissions: {
              items: [{
                conceptId: 'C100000-EDSC',
                permissions: ['read', 'delete']
              }]
            }
          })
        })
      })

      describe('for a multiple concept ids', () => {
        test('permissions', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 1,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/access-control\/permissions/)
            .reply(200, {
              'C100000-EDSC': ['read', 'delete'],
              'C100001-EDSC': ['read']
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                conceptIds: ['C100000-EDSC', 'C100001-EDSC']
              }
            },
            query: `
              query GetPermissions($params: PermissionsInput) {
                permissions(params: $params) {
                  items {
                    conceptId
                    permissions
                  }
                }
              }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()
          expect(data).toEqual({
            permissions: {
              items: [{
                conceptId: 'C100000-EDSC',
                permissions: ['read', 'delete']
              }, {
                conceptId: 'C100001-EDSC',
                permissions: ['read']
              }]
            }
          })
        })
      })

      describe('for system objects', () => {
        test('permissions', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 1,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/access-control\/permissions/)
            .reply(200, {
              ANY_ACL: ['read', 'delete']
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                systemObject: 'ANY_ACL'
              }
            },
            query: `
              query GetPermissions($params: PermissionsInput) {
                permissions(params: $params) {
                  items {
                    systemObject
                    permissions
                  }
                }
              }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()
          expect(data).toEqual({
            permissions: {
              items: [{
                systemObject: 'ANY_ACL',
                permissions: ['read', 'delete']
              }]
            }
          })
        })
      })

      describe('for target and provider', () => {
        test('permissions', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 1,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/access-control\/permissions/)
            .reply(200, {
              GROUP: ['read']
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                target: 'GROUP',
                provider: 'PROVIDER'
              }
            },
            query: `
              query GetPermissions($params: PermissionsInput) {
                permissions(params: $params) {
                  items {
                    target
                    permissions
                  }
                }
              }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()
          expect(data).toEqual({
            permissions: {
              items: [{
                target: 'GROUP',
                permissions: ['read']
              }]
            }
          })
        })

        describe('when provider is not provided', () => {
          test('cmr returns an error and its handled', async () => {
            nock(/example-cmr/)
              .defaultReplyHeaders({
                'CMR-Hits': 1,
                'CMR-Took': 7,
                'CMR-Request-Id': 'abcd-1234-efgh-5678'
              })
              .get(/access-control\/permissions/)
              .reply(400, {
                errors: [
                  'One of [concept_id], [system_object], [target_group_id], or [provider] and [target] are required.'
                ]
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  target: 'GROUP'
                }
              },
              query: `
                  query GetPermissions($params: PermissionsInput) {
                    permissions(params: $params) {
                      items {
                        target
                        permissions
                      }
                    }
                  }`
            }, {
              contextValue
            })

            const { data, errors } = response.body.singleResult

            const [firstError] = errors
            const { message } = firstError

            expect(message).toEqual('One of [concept_id], [system_object], [target_group_id], or [provider] and [target] are required.')
            expect(data).toEqual(null)
          })
        })
      })
    })
  })
})
