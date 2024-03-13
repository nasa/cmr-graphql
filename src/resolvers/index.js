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
import orderOptionResolver from './orderOption'
import serviceResolver from './service'
import serviceDraftResolver from './serviceDraft'
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
  orderOptionResolver,
  serviceResolver,
  serviceDraftResolver,
  subscriptionResolver,
  tagDefinitionResolver,
  toolDraftResolver,
  toolResolver,
  variableDraftResolver,
  variableResolver
]

export default mergeResolvers(resolvers)
