import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    tags: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.tagSource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  }
}
