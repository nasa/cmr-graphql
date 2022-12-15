import { ApolloServer } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { v4 as uuidv4 } from 'uuid'

import DataLoader from 'dataloader'

import resolvers from '../resolvers'
import typeDefs from '../types'

import collectionDraftProposalSource from '../datasources/collectionDraftProposal'
import collectionDraftSource from '../datasources/collectionDraft'
import collectionSource from '../datasources/collection'
import granuleSource from '../datasources/granule'
import graphDbDuplicateCollectionsSource from '../datasources/graphDbDuplicateCollections'
import graphDbSource from '../datasources/graphDb'
import gridSource from '../datasources/grid'
import serviceSource from '../datasources/service'
import toolSource from '../datasources/tool'
import variableSource from '../datasources/variable'

import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../datasources/subscription'

import { downcaseKeys } from '../utils/downcaseKeys'
import { verifyEDLJwt } from '../utils/verifyEDLJwt'

import { getCollectionsById } from '../dataloaders/getCollectionsById'

// Creating the server
const server = new ApolloServer({
  // Passing types and resolvers to the server
  typeDefs,
  resolvers,

  // Initial context state, will be available in resolvers
  context: async ({ event }) => {
    const { body, headers } = event

    const { operationName } = JSON.parse(body)

    // If the query is the IntrospectionQuery, return out of this method
    // The IntrospectionQuery is used when the playground has schema polling
    // enabled. Returning out of this method for those calls saves API
    // requests to URS and database calls
    if (operationName === 'IntrospectionQuery') return null

    const {
      authorization: bearerToken,
      'client-id': clientId,
      'x-request-id': requestId
    } = downcaseKeys(headers)

    // Context object that we'll provide to each resolver
    const context = {}

    // Default headers to be sent with every external request
    const requestHeaders = {
      'CMR-Request-Id': requestId || uuidv4()
    }

    // If the client has provided an EDL token supply it to CMR
    if (bearerToken) {
      requestHeaders.Authorization = bearerToken

      // regex to match JWT token structures
      const regex = /^Bearer [A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*/

      // If this is a JWT token verify that the token is from EDL and retrieve the earthdata login username
      if (regex.test(bearerToken)) {
        const edlUsername = await verifyEDLJwt(bearerToken)

        // Check to ensure edlUsername has a value, and doesn't evaluate to false (indicating a failed token validation)
        if (edlUsername) {
          context.edlUsername = edlUsername
        }
      }
    }

    // Concatenate this applications client id with the user provided value, if one was provided
    requestHeaders['Client-Id'] = [
      clientId,
      `eed-${process.env.stage}-graphql`
    ].filter(Boolean).join('-')

    return {
      ...context,
      headers: requestHeaders,
      collectionLoader: new DataLoader(getCollectionsById, { cacheKeyFn: (obj) => obj.conceptId })
    }
  },

  // An object that goes to the 'context' argument when executing resolvers
  dataSources: () => ({
    collectionDraftProposalSource,
    collectionDraftSource,
    collectionSource,
    granuleSource,
    graphDbDuplicateCollectionsSource,
    graphDbSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolSource,
    variableSource,
    gridSource
  }),

  // Show the landing page (which has a link to Apollo Studio Sandbox) in all environments
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      // But hide the footer, it just shows a link to docs about the landing page
      footer: false
    })
  ]
})

export default server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: true,
      credentials: true,
      allowedHeaders: [
        'Accept',
        'Authorization',
        'Client-Id',
        'Content-Type',
        'X-Request-Id'
      ]
    }
  }
})
