import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    granules: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.granuleSource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    granule: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.granuleSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },
  Granule: {
    collection: async (source, args, context, info) => {
      const { collectionLoader } = context

      // If collection is requested, collectionConceptId will be included in the granule response
      const { collectionConceptId } = source

      const result = await collectionLoader.load({
        conceptId: collectionConceptId,
        context,
        parsedInfo: parseResolveInfo(info)
      })

      return result
    }
  }
}
