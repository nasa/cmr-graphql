import { ApolloServer } from 'apollo-server-lambda'
import { v4 as uuidv4 } from 'uuid'

import resolvers from '../resolvers'
import typeDefs from '../types'

import collectionSource from '../datasources/collection'
import granuleSource from '../datasources/granule'
import serviceSource from '../datasources/service'
import variableSource from '../datasources/variable'

// Creating the server
const server = new ApolloServer({
  // Passing types and resolvers to the server
  typeDefs,
  resolvers,

  // Initial context state, will be available in resolvers
  context: ({ event }) => {
    const { headers } = event

    const {
      'Echo-Token': token,
      'X-Request-ID': requestId
    } = headers

    const requestHeaders = {
      'CMR-Request-ID': requestId || uuidv4()
    }

    if (token) requestHeaders['Echo-Token'] = token

    // add the user to the context
    return {
      headers: requestHeaders
    }
  },

  // An object that goes to the 'context' argument when executing resolvers
  dataSources: () => ({
    collectionSource,
    granuleSource,
    serviceSource,
    variableSource
  })
})

export const graphqlHandler = server.createHandler({
  cors: {
    origin: true,
    credentials: true
  }
})

/**
 * Construct and run a GraphQL query against CMR
 * @param {Object} event AWS Event object
 * @param {Object} context Handler context
 * @param {Function} callback Callback function to call when complete
 */
const graphql = (event, context, callback) => {
  // Tell AWS lambda we do not want to wait for NodeJS event loop to be empty in order to send the response
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Use Apollo Server to construct the callback
  const handler = server.createHandler()

  // Call and return the callback from Apollo Server
  return handler(event, context, callback)
}

export default graphql
