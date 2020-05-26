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
  }
}
