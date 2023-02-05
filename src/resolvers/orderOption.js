import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    orderOptions: async (source, args, context, info) => {
      const { dataSources } = context

      // eslint-disable-next-line max-len
      return dataSources.orderOptionSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    orderOption: async (source, args, context, info) => {
      const { dataSources } = context
      const result = await dataSources.orderOptionSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
