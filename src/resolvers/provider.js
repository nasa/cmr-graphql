import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    providers: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.providerSource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  }
}
