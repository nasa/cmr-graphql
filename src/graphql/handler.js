import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { v4 as uuidv4 } from 'uuid'

import resolvers from '../resolvers'
import typeDefs from '../types'

import collectionSource from '../datasources/collection'
import collectionDraftSource from '../datasources/collectionDraft'
import collectionDraftProposalSource from '../datasources/collectionDraftProposal'
import granuleSource from '../datasources/granule'
import graphDbSource from '../datasources/graphDb'
import serviceSource from '../datasources/service'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../datasources/subscription'
import toolSource from '../datasources/tool'
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
      Authorization: bearerToken,
      'Client-Id': clientId,
      'Echo-Token': echoToken,
      'X-Request-Id': requestId
    } = headers

    const requestHeaders = {
      'CMR-Request-Id': requestId || uuidv4()
    }

    // If the client has provided an EDL token supply it to CMR
    if (bearerToken) requestHeaders.Authorization = bearerToken

    // If the client has identified themselves using Client-Id supply it to CMR
    if (clientId) requestHeaders['Client-Id'] = clientId

    // If the client has provided an EDL token supply it to CMR
    if (echoToken) requestHeaders['Echo-Token'] = echoToken

    // add the user to the context
    return {
      headers: requestHeaders
    }
  },

  // An object that goes to the 'context' argument when executing resolvers
  dataSources: () => ({
    collectionSource,
    collectionDraftSource,
    collectionDraftProposalSource,
    granuleSource,
    graphDbSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolSource,
    variableSource
  }),

  // Show the landing page (which has a link to Apollo Studio Sandbox) in all environments
  plugins: [ApolloServerPluginLandingPageLocalDefault({
    // But hide the footer, it just shows a link to docs about the landing page
    footer: false
  })]
})

export default server.createHandler({
  cors: {
    origin: true,
    allowedHeaders: [
      'Accept',
      'Client-Id',
      'Content-Type',
      'X-Request-Id'
    ]
  }
})
