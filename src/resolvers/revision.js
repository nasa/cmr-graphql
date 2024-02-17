import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
// import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
  Query: {
    // revisions: async (source, args, context, info) => {
    //   const { dataSources } = context

    //   return dataSources.revisionSource(handlePagingParams(args), context, parseResolveInfo(info))
    // },
    revision: async (source, args, context, info) => {
      const { dataSources } = context
      

      const result = await dataSources.revisionSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
