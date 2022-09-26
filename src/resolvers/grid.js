import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    grids: async (source, args, { dataSources, headers }, info) => (
      dataSources.gridSource(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    grid: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.gridSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
