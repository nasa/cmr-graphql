import { mergeResolvers } from '@graphql-tools/merge'

import collectionDraftResolver from './collectionDraft'
import collectionDraftProposalResolver from './collectionDraftProposal'
import collectionResolver from './collection'
import granuleResolver from './granule'
import gridResolver from './grid'
import serviceResolver from './service'
import subscriptionResolver from './subscription'
import toolResolver from './tool'
import variableResolver from './variable'

const resolvers = [
  collectionDraftResolver,
  collectionDraftProposalResolver,
  collectionResolver,
  granuleResolver,
  gridResolver,
  serviceResolver,
  subscriptionResolver,
  toolResolver,
  variableResolver
]

export default mergeResolvers(resolvers)
