import { ApolloServer } from '@apollo/server'

import resolvers from '../..'
import typeDefs from '../../../types'

import collectionDraftProposalSource from '../../../datasources/collectionDraftProposal'
import collectionDraftSource from '../../../datasources/collectionDraft'
import collectionSource from '../../../datasources/collection'
import collectionVariableDraftsSource from '../../../datasources/collectionVariableDrafts'
import dataQualitySummarySource from '../../../datasources/dataQualitySummary'
import granuleSource from '../../../datasources/granule'
import graphDbDuplicateCollectionsSource from '../../../datasources/graphDbDuplicateCollections'
import graphDbSource from '../../../datasources/graphDb'
import gridSource from '../../../datasources/grid'
import maxItemsPerOrderSource from '../../../datasources/maxItemsPerOrder'
import orderOptionSource from '../../../datasources/orderOption'
import serviceSource from '../../../datasources/service'
import serviceDraftSource from '../../../datasources/serviceDraft'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../../datasources/subscription'
import toolSource from '../../../datasources/tool'
import toolDraftSource from '../../../datasources/toolDraft'
import variableDraftSource from '../../../datasources/variableDraft'
import variableSource from '../../../datasources/variable'
import {
  deleteDraft as draftSourceDelete,
  fetchDrafts as draftSourceFetch,
  ingestDraft as draftSourceIngest,
  publishDraft as draftSourcePublish
} from '../../../datasources/draft'

export const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const buildContextValue = (extraContext) => ({
  dataSources: {
    collectionDraftProposalSource,
    collectionDraftSource,
    collectionSource,
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
    orderOptionSource,
    serviceDraftSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolDraftSource,
    toolSource,
    variableDraftSource,
    variableSource
  },
  headers: {
    'Client-Id': 'eed-test-graphql',
    'CMR-Request-Id': 'abcd-1234-efgh-5678'
  },
  ...extraContext
})
