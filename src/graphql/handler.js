import { ApolloServer } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault
} from '@apollo/server/plugin/landingPage/default'
import { createStellateLoggerPlugin } from 'stellate/apollo-server'
import { handlers, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda'
import { v4 as uuidv4 } from 'uuid'

import DataLoader from 'dataloader'

import resolvers from '../resolvers'
import typeDefs from '../types'

import {
  createAcl as aclSourceCreate,
  deleteAcl as aclSourceDelete,
  fetchAcl as aclSourceFetch,
  updateAcl as aclSourceUpdate
} from '../datasources/acl'
import {
  createAssociation as associationSourceCreate,
  deleteAssociation as associationSourceDelete
} from '../datasources/association'
import collectionDraftProposalSource from '../datasources/collectionDraftProposal'
import collectionDraftSource from '../datasources/collectionDraft'
import collectionVariableDraftsSource from '../datasources/collectionVariableDrafts'
import dataQualitySummarySource from '../datasources/dataQualitySummary'
import granuleSource from '../datasources/granule'
import graphDbDuplicateCollectionsSource from '../datasources/graphDbDuplicateCollections'
import graphDbSource from '../datasources/graphDb'
import gridSource from '../datasources/grid'
import maxItemsPerOrderSource from '../datasources/maxItemsPerOrder'
import permissionSource from '../datasources/permission'
import providerSource from '../datasources/provider'
import serviceDraftSource from '../datasources/serviceDraft'
import tagDefinitionSource from '../datasources/tagDefinition'
import toolDraftSource from '../datasources/toolDraft'
import variableDraftSource from '../datasources/variableDraft'

import {
  deleteTool as toolSourceDelete,
  fetchTools as toolSourceFetch,
  restoreToolRevision as toolSourceRestoreRevision
} from '../datasources/tool'

import {
  deleteCollection as collectionSourceDelete,
  fetchCollections as collectionSourceFetch,
  restoreCollectionRevision as collectionSourceRestoreRevision
} from '../datasources/collection'

import {
  deleteService as serviceSourceDelete,
  fetchServices as serviceSourceFetch,
  restoreServiceRevision as serviceSourceRestoreRevision
} from '../datasources/service'

import {
  deleteVariable as variableSourceDelete,
  fetchVariables as variableSourceFetch,
  restoreVariableRevision as variableSourceRestoreRevision
} from '../datasources/variable'

import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../datasources/subscription'

import {
  deleteDraft as draftSourceDelete,
  fetchDrafts as draftSourceFetch,
  ingestDraft as draftSourceIngest,
  publishDraft as draftSourcePublish
} from '../datasources/draft'

import {
  deleteOrderOption as orderOptionSourceDelete,
  fetchOrderOption as orderOptionSourceFetch,
  ingestOrderOption as orderOptionSourceIngest
} from '../datasources/orderOption'

import { downcaseKeys } from '../utils/downcaseKeys'
import { verifyEDLJwt } from '../utils/verifyEDLJwt'

import { getCollectionsById } from '../dataloaders/getCollectionsById'

const { env } = process

// Initialize the plugins with those we always want enabled
const apolloPlugins = [
  ApolloServerPluginLandingPageLocalDefault({
    embed: false,
    footer: false
  })
]

const { IS_OFFLINE: isOffline } = env

// Only utilize stellate in deployed environments
if (!isOffline) {
  const {
    stellateAppName,
    stellateKey
  } = env

  apolloPlugins.push(
    createStellateLoggerPlugin({
      serviceName: stellateAppName,
      token: stellateKey,
      fetch
    })
  )
}

const server = new ApolloServer({
  // Passing types and resolvers to the server
  typeDefs,
  resolvers,
  introspection: true,
  plugins: apolloPlugins
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

        // Regex to match JWT token structures
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

      requestHeaders.User = context.edlUsername

      return {
        ...context,
        dataSources: {
          aclSourceCreate,
          aclSourceDelete,
          aclSourceFetch,
          aclSourceUpdate,
          associationSourceCreate,
          associationSourceDelete,
          collectionDraftProposalSource,
          collectionDraftSource,
          collectionSourceDelete,
          collectionSourceFetch,
          collectionSourceRestoreRevision,
          collectionVariableDraftsSource,
          dataQualitySummarySource,
          draftSourceDelete,
          draftSourceFetch,
          draftSourceIngest,
          draftSourcePublish,
          granuleSource,
          graphDbDuplicateCollectionsSource,
          graphDbSource,
          gridSource,
          maxItemsPerOrderSource,
          orderOptionSourceDelete,
          orderOptionSourceFetch,
          orderOptionSourceIngest,
          permissionSource,
          providerSource,
          serviceDraftSource,
          serviceSourceDelete,
          serviceSourceFetch,
          serviceSourceRestoreRevision,
          subscriptionSourceDelete,
          subscriptionSourceFetch,
          subscriptionSourceIngest,
          tagDefinitionSource,
          toolDraftSource,
          toolSourceDelete,
          toolSourceFetch,
          toolSourceRestoreRevision,
          variableDraftSource,
          variableSourceRestoreRevision,
          variableSourceDelete,
          variableSourceFetch
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
