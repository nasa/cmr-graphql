import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    orderOptions: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.orderOptionSourceFetch(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    orderOption: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.orderOptionSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  OrderOption: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        associations = {}
      } = source

      const { collections = [] } = associations

      // If there are no associations to collections for this order option
      if (!collections.length) {
        return {
          count: 0,
          items: null
        }
      }

      const requestedParams = handlePagingParams({
        conceptId: collections,
        ...args
      })

      return dataSources.collectionSourceFetch(requestedParams, context, parseResolveInfo(info))
    }
  },

  Mutation: {
    createOrderOption: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.orderOptionSourceIngest(args, context, parseResolveInfo(info))
    },

    updateOrderOption: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.orderOptionSourceIngest(args, context, parseResolveInfo(info))
    },

    deleteOrderOption: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.orderOptionSourceDelete(args, context, parseResolveInfo(info))
    }
  }
}
