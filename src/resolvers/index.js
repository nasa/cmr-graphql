import { mergeResolvers } from '@graphql-tools/merge'

import collectionResolver from './collection'
import granuleResolver from './granule'
import serviceResolver from './service'
import subscriptionResolver from './subscription'
import toolResolver from './tool'
import variableResolver from './variable'

const resolvers = [
  collectionResolver,
  granuleResolver,
  serviceResolver,
  subscriptionResolver,
  toolResolver,
  variableResolver
]

export default mergeResolvers(resolvers)
