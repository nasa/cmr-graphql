import { ApolloServer } from '@apollo/server'

import resolvers from '../..'
import typeDefs from '../../../types'

import {
  createAcl as aclSourceCreate,
  deleteAcl as aclSourceDelete,
  fetchAcl as aclSourceFetch,
  updateAcl as aclSourceUpdate
} from '../../../datasources/acl'
import {
  createAssociation as associationSourceCreate,
  deleteAssociation as associationSourceDelete
} from '../../../datasources/association'
import collectionDraftProposalSource from '../../../datasources/collectionDraftProposal'
import collectionDraftSource from '../../../datasources/collectionDraft'
import collectionVariableDraftsSource from '../../../datasources/collectionVariableDrafts'
import dataQualitySummarySource from '../../../datasources/dataQualitySummary'
import granuleSource from '../../../datasources/granule'
import graphDbAssociatedCitations from '../../../datasources/graphDbAssociatedCitations'
import graphDbDuplicateCollectionsSource from '../../../datasources/graphDbDuplicateCollections'
import graphDbRelatedCollectionsSource from '../../../datasources/graphDbRelatedCollections'
import gridSource from '../../../datasources/grid'
import maxItemsPerOrderSource from '../../../datasources/maxItemsPerOrder'
import permissionSource from '../../../datasources/permission'
import providerSource from '../../../datasources/provider'
import serviceDraftSource from '../../../datasources/serviceDraft'
import tagDefinitionSource from '../../../datasources/tagDefinition'
import toolDraftSource from '../../../datasources/toolDraft'
import variableDraftSource from '../../../datasources/variableDraft'

import {
  deleteTool as toolSourceDelete,
  fetchTools as toolSourceFetch,
  restoreToolRevision as toolSourceRestoreRevision
} from '../../../datasources/tool'

import {
  deleteCitation as citationSourceDelete,
  fetchCitations as citationSourceFetch
} from '../../../datasources/citation'

import {
  deleteCollection as collectionSourceDelete,
  fetchCollections as collectionSourceFetch,
  restoreCollectionRevision as collectionSourceRestoreRevision
} from '../../../datasources/collection'

import {
  deleteService as serviceSourceDelete,
  fetchServices as serviceSourceFetch,
  restoreServiceRevision as serviceSourceRestoreRevision
} from '../../../datasources/service'

import {
  deleteVariable as variableSourceDelete,
  fetchVariables as variableSourceFetch,
  restoreVariableRevision as variableSourceRestoreRevision
} from '../../../datasources/variable'

import {
  deleteVisualization as visualizationSourceDelete,
  fetchVisualizations as visualizationSourceFetch,
  restoreVisualizationRevision as visualizationSourceRestoreRevision
} from '../../../datasources/visualization'

import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../../datasources/subscription'

import {
  deleteDraft as draftSourceDelete,
  fetchDrafts as draftSourceFetch,
  ingestDraft as draftSourceIngest,
  publishDraft as draftSourcePublish
} from '../../../datasources/draft'

import {
  deleteOrderOption as orderOptionSourceDelete,
  fetchOrderOption as orderOptionSourceFetch,
  ingestOrderOption as orderOptionSourceIngest
} from '../../../datasources/orderOption'

import {
  createGroup as groupSourceCreate,
  deleteGroup as groupSourceDelete,
  fetchGroup as groupSourceFetch,
  listGroupMembers as groupSourceListMembers,
  searchGroup as groupSourceSearch,
  updateGroup as groupSourceUpdate
} from '../../../datasources/group'

export const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const buildContextValue = (extraContext) => ({
  dataSources: {
    aclSourceCreate,
    aclSourceDelete,
    aclSourceFetch,
    aclSourceUpdate,
    associationSourceCreate,
    associationSourceDelete,
    citationSourceDelete,
    citationSourceFetch,
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
    graphDbAssociatedCitations,
    graphDbDuplicateCollectionsSource,
    graphDbRelatedCollectionsSource,
    gridSource,
    groupSourceCreate,
    groupSourceDelete,
    groupSourceFetch,
    groupSourceListMembers,
    groupSourceSearch,
    groupSourceUpdate,
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
    variableSourceDelete,
    variableSourceFetch,
    variableSourceRestoreRevision,
    visualizationSourceDelete,
    visualizationSourceFetch,
    visualizationSourceRestoreRevision
  },
  headers: {
    'Client-Id': 'eed-test-graphql',
    'CMR-Request-Id': 'abcd-1234-efgh-5678',
    'X-Request-Id': 'abcd-1234-efgh-5678'
  },
  ...extraContext
})
