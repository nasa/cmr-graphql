import { mergeResolvers } from '@graphql-tools/merge'

import aclResolver from './acl'
import collectionDraftProposalResolver from './collectionDraftProposal'
import collectionDraftResolver from './collectionDraft'
import collectionResolver from './collection'
import dataQualitySummaryResolver from './dataQualitySummary'
import draftResolver from './draft'
import granuleResolver from './granule'
import gridResolver from './grid'
import orderOptionResolver from './orderOption'
import revisionResolver from './revision'
import serviceResolver from './service'
import serviceDraftResolver from './serviceDraft'
import subscriptionResolver from './subscription'
import toolDraftResolver from './toolDraft'
import toolResolver from './tool'
import variableDraftResolver from './variableDraft'
import variableResolver from './variable'

const resolvers = [
  aclResolver,
  collectionDraftProposalResolver,
  collectionDraftResolver,
  collectionResolver,
  dataQualitySummaryResolver,
  draftResolver,
  granuleResolver,
  gridResolver,
  orderOptionResolver,
  revisionResolver,
  serviceResolver,
  serviceDraftResolver,
  subscriptionResolver,
  toolDraftResolver,
  toolResolver,
  variableDraftResolver,
  variableResolver
]

export default mergeResolvers(resolvers)
