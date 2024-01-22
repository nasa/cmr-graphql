import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    acl: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.aclSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}