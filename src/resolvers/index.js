import { mergeResolvers } from '@graphql-tools/merge'

import collectionDraftResolver from './collectionDraft'
import collectionDraftProposalResolver from './collectionDraftProposal'
import collectionResolver from './collection'
import granuleResolver from './granule'
import serviceResolver from './service'
import subscriptionResolver from './subscription'
import toolResolver from './tool'
import variableResolver from './variable'
import gridResolver from './grid'

const resolvers = [
  collectionDraftResolver,
  collectionDraftProposalResolver,
  collectionResolver,
  granuleResolver,
  serviceResolver,
  subscriptionResolver,
  toolResolver,
  variableResolver,
  gridResolver
]

export default mergeResolvers(resolvers)
