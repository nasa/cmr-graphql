import { mergeResolvers } from '@graphql-tools/merge'

import aclResolver from './acl'
import associationResolver from './association'
import collectionDraftProposalResolver from './collectionDraftProposal'
import collectionDraftResolver from './collectionDraft'
import collectionResolver from './collection'
import dataQualitySummaryResolver from './dataQualitySummary'
import draftResolver from './draft'
import granuleResolver from './granule'
import gridResolver from './grid'
import groupResolver from './group'
import orderOptionResolver from './orderOption'
import permissionResolver from './permission'
import providerResolver from './provider'
import serviceDraftResolver from './serviceDraft'
import serviceResolver from './service'
import subscriptionResolver from './subscription'
import tagDefinitionResolver from './tagDefinition'
import toolDraftResolver from './toolDraft'
import toolResolver from './tool'
import variableDraftResolver from './variableDraft'
import variableResolver from './variable'

const resolvers = [
  aclResolver,
  associationResolver,
  collectionDraftProposalResolver,
  collectionDraftResolver,
  collectionResolver,
  dataQualitySummaryResolver,
  draftResolver,
  granuleResolver,
  gridResolver,
  groupResolver,
  orderOptionResolver,
  permissionResolver,
  providerResolver,
  serviceDraftResolver,
  serviceResolver,
  subscriptionResolver,
  tagDefinitionResolver,
  toolDraftResolver,
  toolResolver,
  variableDraftResolver,
  variableResolver
]

export default mergeResolvers(resolvers)
