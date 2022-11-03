import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    tools: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.toolSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    tool: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.toolSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Tool: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      const requestedParams = handlePagingParams({
        toolConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSource(requestedParams, context, parseResolveInfo(info))
    }
  }
}
