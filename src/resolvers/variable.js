import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    variables: async (source, args, { dataSources, headers }, info) => (
      dataSources.variableSource(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    variable: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.variableSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Variable: {
    collections: async (source, args, { dataSources, headers }, info) => {
      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      const requestedParams = handlePagingParams({
        variableConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSource(requestedParams, headers, parseResolveInfo(info))
    }
  }
}
