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
      'Client-Id': clientId,
      'Echo-Token': token,
      'X-Request-ID': requestId
    } = headers

    const requestHeaders = {
      'CMR-Request-ID': requestId || uuidv4()
    }

    // If the client has identified themselves using Client-Id supply it to CMR
    if (clientId) requestHeaders['Client-Id'] = clientId

    // If the client has provided an EDL token supply it to CMR
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

export default server.createHandler({
  cors: {
    origin: true,
    allowedHeaders: [
      'Client-Id',
      'Content-Type',
      'X-Request-Id'
    ]
  }
})
