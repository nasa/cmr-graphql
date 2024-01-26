import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    acls: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.aclSource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  }
}
