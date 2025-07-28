import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from '@apollo/server'
import { applyMiddleware } from 'graphql-middleware'
import gql from 'graphql-tag'

import typeDefs from '../../types'
import permissions from '..'
import * as hasPermission from '../../utils/hasPermission'

const schemaWithCMRError = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers: {
      Query: {
        groups: vi.fn().mockImplementation(() => {
          const error = new Error('mock cmr error')
          error.extensions = { code: 'CMR_ERROR' }
          throw error
        })
      }
    }
  }),
  permissions
)

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers: {
      Query: {
        groups: vi.fn().mockImplementation(() => { throw new Error('mock error') })
      }
    }
  }),
  permissions
)

const setupServerWithCMRError = () => (
  new ApolloServer({
    schema: schemaWithCMRError
  })
)
const setupServer = () => (
  new ApolloServer({
    schema
  })
)
const contextValue = {
  dataSources: {},
  edlUsername: 'testUser',
  requestId: 'mock-request-id'
}

describe('fallbackError', () => {
  describe('when requestId is present', () => {
    test('throws an error with the requestId in it', async () => {
      vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

      const server = setupServer()

      const query = gql`
        query Groups (
          $params: GroupsInput
        ) {
          groups (
            params: $params
          ) {
            count
            items {
              id
              name
              description
              tag
            }
          }
        }
      `

      const variables = {
        params: {
          tags: ['CMR']
        }
      }

      const result = await server.executeOperation({
        query,
        variables
      }, {
        contextValue
      })

      expect(result.body.singleResult.errors[0].message).toEqual('An unknown error occurred. Please refer to the ID mock-request-id when contacting Earthdata Operations (support@earthdata.nasa.gov).')
    })
  })

  describe('when extensions are present and have a code of CMR_ERROR', () => {
    test('the error from CMR is surfaced', async () => {
      vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

      const server = setupServerWithCMRError()

      const query = gql`
        query Groups (
          $params: GroupsInput
        ) {
          groups (
            params: $params
          ) {
            count
            items {
              id
              name
              description
              tag
            }
          }
        }
      `

      const variables = {
        params: {
          tags: ['CMR']
        }
      }

      const result = await server.executeOperation({
        query,
        variables
      }, {
        contextValue
      })

      expect(result.body.singleResult.errors[0].message).toEqual('mock cmr error')
    })
  })
})
