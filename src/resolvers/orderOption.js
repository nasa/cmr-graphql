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
