import { mergeResolvers } from 'merge-graphql-schemas'

import collectionResolver from './collection'
import granuleResolver from './granule'
import serviceResolver from './service'
import variableResolver from './variable'

const resolvers = [
  collectionResolver,
  granuleResolver,
  serviceResolver,
  variableResolver
]

export default mergeResolvers(resolvers)
