import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    acl: async (source, args, context, info) => {
      console.log('🚀 ~ acl: ~ args:', context)
      const { dataSources } = context

      const result = await dataSources.aclSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
