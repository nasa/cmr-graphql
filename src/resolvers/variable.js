import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    variables: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.variableSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    variable: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.variableSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Variable: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      const requestedParams = handlePagingParams({
        variableConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSource(requestedParams, context, parseResolveInfo(info))
    }
  }
}
