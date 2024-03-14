import { ApolloServer } from '@apollo/server'

import resolvers from '../..'
import typeDefs from '../../../types'

import aclSource from '../../../datasources/acl'
import {
  createAssociation as associationSourceCreate,
  createVariableAssociation as variableAssociationSourceCreate,
  deleteAssociation as associationSourceDelete
} from '../../../datasources/association'
import collectionDraftProposalSource from '../../../datasources/collectionDraftProposal'
import collectionDraftSource from '../../../datasources/collectionDraft'
import collectionVariableDraftsSource from '../../../datasources/collectionVariableDrafts'
import dataQualitySummarySource from '../../../datasources/dataQualitySummary'
import granuleSource from '../../../datasources/granule'
import graphDbDuplicateCollectionsSource from '../../../datasources/graphDbDuplicateCollections'
import graphDbSource from '../../../datasources/graphDb'
import gridSource from '../../../datasources/grid'
import maxItemsPerOrderSource from '../../../datasources/maxItemsPerOrder'
import orderOptionSource from '../../../datasources/orderOption'
import providerSource from '../../../datasources/provider'
import serviceDraftSource from '../../../datasources/serviceDraft'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../../datasources/subscription'
import tagDefinitionSource from '../../../datasources/tagDefinition'
import {
  deleteTool as toolSourceDelete,
  fetchTools as toolSourceFetch
} from '../../../datasources/tool'
import {
  deleteService as serviceSourceDelete,
  fetchServices as serviceSourceFetch
} from '../../../datasources/service'
import {
  deleteVariable as variableSourceDelete,
  fetchVariables as variableSourceFetch
} from '../../../datasources/variable'
import toolDraftSource from '../../../datasources/toolDraft'
import variableDraftSource from '../../../datasources/variableDraft'

import {
  deleteDraft as draftSourceDelete,
  fetchDrafts as draftSourceFetch,
  ingestDraft as draftSourceIngest,
  publishDraft as draftSourcePublish
} from '../../../datasources/draft'

import {
  deleteCollection as collectionSourceDelete,
  fetchCollections as collectionSourceFetch
} from '../../../datasources/collection'

export const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const buildContextValue = (extraContext) => ({
  dataSources: {
    aclSource,
    associationSourceCreate,
    associationSourceDelete,
    collectionDraftProposalSource,
    collectionDraftSource,
    collectionSourceDelete,
    collectionSourceFetch,
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
    providerSource,
    serviceDraftSource,
    serviceSourceDelete,
    serviceSourceFetch,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    tagDefinitionSource,
    toolDraftSource,
    toolSourceDelete,
    toolSourceFetch,
    variableAssociationSourceCreate,
    variableDraftSource,
    variableSourceDelete,
    variableSourceFetch
  },
  headers: {
    'Client-Id': 'eed-test-graphql',
    'CMR-Request-Id': 'abcd-1234-efgh-5678'
  },
  ...extraContext
})
