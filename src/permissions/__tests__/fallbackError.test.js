import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from '@apollo/server'
import { applyMiddleware } from 'graphql-middleware'
import gql from 'graphql-tag'

import typeDefs from '../../types'
import permissions from '..'
import * as hasPermission from '../../utils/hasPermission'

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

const setupServer = () => (
  new ApolloServer({
    schema
  })
)

const contextValue = {
  dataSources: {},
  requestId: 'mock-request-id',
  user: { ursId: 'testUser' }
}

describe('fallbackError', () => {
  test('throws an error with the requestId present', async () => {
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
