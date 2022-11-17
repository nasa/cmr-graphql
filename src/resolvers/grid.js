import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    grids: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.gridSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    grid: async (source, args, context, info) => {
      const { dataSources } = context
      const result = await dataSources.gridSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
