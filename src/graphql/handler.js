import { ApolloServer } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault
} from '@apollo/server/plugin/landingPage/default'
import { handlers, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda'
import { v4 as uuidv4 } from 'uuid'

import DataLoader from 'dataloader'

import resolvers from '../resolvers'
import typeDefs from '../types'

import collectionDraftProposalSource from '../datasources/collectionDraftProposal'
import collectionDraftSource from '../datasources/collectionDraft'
import collectionSource from '../datasources/collection'
import dataQualitySummarySource from '../datasources/dataQualitySummary'
import granuleSource from '../datasources/granule'
import graphDbDuplicateCollectionsSource from '../datasources/graphDbDuplicateCollections'
import graphDbSource from '../datasources/graphDb'
import gridSource from '../datasources/grid'
import maxItemsPerOrderSource from '../datasources/maxItemsPerOrder'
import orderOptionSource from '../datasources/orderOption'
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

const server = new ApolloServer({
  // Passing types and resolvers to the server
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: false, footer: false })]
})

export default startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
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
        dataSources: {
          collectionDraftProposalSource,
          collectionDraftSource,
          collectionSource,
          dataQualitySummarySource,
          granuleSource,
          graphDbDuplicateCollectionsSource,
          graphDbSource,
          maxItemsPerOrderSource,
          orderOptionSource,
          serviceSource,
          subscriptionSourceDelete,
          subscriptionSourceFetch,
          subscriptionSourceIngest,
          toolSource,
          variableSource,
          gridSource
        },
        headers: requestHeaders,
        collectionLoader: new DataLoader(getCollectionsById, { cacheKeyFn: (obj) => obj.conceptId })
      }
    },
    middleware: [
      () => async (result) => {
        // Set CORS options
        const { headers } = result
        // eslint-disable-next-line no-param-reassign
        result.headers = {
          ...headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': [
            'Accept',
            'Authorization',
            'Client-Id',
            'Content-Type',
            'X-Request-Id'
          ].join(', ')
        }
      }
    ]
  }
)
