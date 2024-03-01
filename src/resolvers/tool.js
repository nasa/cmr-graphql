import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
  Query: {
    tools: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.toolSourceFetch(handlePagingParams(args), context, parseResolveInfo(info))
    },
    tool: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.toolSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    deleteTool: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.toolSourceDelete(handlePagingParams(args), context, parseResolveInfo(info))
    }
  },

  Tool: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const { conceptId } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'tool')) return null

      const requestedParams = handlePagingParams({
        toolConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSourceFetch(requestedParams, context, parseResolveInfo(info))
    }
  }
}
