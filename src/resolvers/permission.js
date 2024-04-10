import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    permissions: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.permissionSource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  }
}
