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
  }
}
