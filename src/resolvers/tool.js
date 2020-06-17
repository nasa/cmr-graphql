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
  }
}
