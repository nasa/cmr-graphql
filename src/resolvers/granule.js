import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    granules: async (source, args, { dataSources, headers }, info) => (
      dataSources.granuleSource(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    granule: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.granuleSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },
  Granule: {
    collection: async (source, args, { dataSources, headers }, info) => {
      // If collection is requested, collectionConceptId will be included in the response
      const { collectionConceptId } = source

      const requestedParams = handlePagingParams({
        conceptId: collectionConceptId,
        ...args
      })

      // Request the collection information
      const result = await dataSources.collectionSource(
        requestedParams,
        headers,
        parseResolveInfo(info)
      )

      // The collection will be the first value in the array
      const [firstResult] = result

      return firstResult
    }
  }
}
