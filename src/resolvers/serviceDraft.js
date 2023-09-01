import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    serviceDraft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.serviceDraftSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
