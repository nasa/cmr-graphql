import { ApolloServer } from '@apollo/server'

import resolvers from '../..'
import typeDefs from '../../../types'

import collectionSource from '../../../datasources/collection'
import collectionDraftSource from '../../../datasources/collectionDraft'
import collectionDraftProposalSource from '../../../datasources/collectionDraftProposal'
import dataQualitySummarySource from '../../../datasources/dataQualitySummary'
import granuleSource from '../../../datasources/granule'
import graphDbSource from '../../../datasources/graphDb'
import graphDbDuplicateCollectionsSource from '../../../datasources/graphDbDuplicateCollections'
import gridSource from '../../../datasources/grid'
import maxItemsPerOrderSource from '../../../datasources/maxItemsPerOrder'
import orderOptionSource from '../../../datasources/orderOption'
import serviceSource from '../../../datasources/service'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../../datasources/subscription'
import toolSource from '../../../datasources/tool'
import toolDraftSource from '../../../datasources/toolDraft'
import variableDraftSource from '../../../datasources/variableDraft'
import variableSource from '../../../datasources/variable'
import { GenerateCollectionVariablesAPI } from '../../../datasources/GenerateCollectionVariablesAPI'

export const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const buildContextValue = (extraContext) => ({
  dataSources: {
    collectionSource,
    collectionDraftSource,
    collectionDraftProposalSource,
    dataQualitySummarySource,
    generateCollectionVariablesApi: new GenerateCollectionVariablesAPI('localhost', 'testtoken'),
    granuleSource,
    graphDbDuplicateCollectionsSource,
    graphDbSource,
    gridSource,
    maxItemsPerOrderSource,
    orderOptionSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolSource,
    toolDraftSource,
    variableSource,
    variableDraftSource
  },
  headers: {
    'Client-Id': 'eed-test-graphql',
    'CMR-Request-Id': 'abcd-1234-efgh-5678'
  },
  ...extraContext
})
