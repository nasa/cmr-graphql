import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    tools: async (source, args, { dataSources, headers }, info) => (
      dataSources.toolSource(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    tool: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.toolSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Tool: {
    collections: async (source, args, { dataSources, headers }, info) => {
      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      const requestedParams = handlePagingParams({
        toolConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSource(requestedParams, headers, parseResolveInfo(info))
    }
  }
}
