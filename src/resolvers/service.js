import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    services: async (source, args, { dataSources, headers }, info) => (
      dataSources.serviceSource(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    service: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.serviceSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
