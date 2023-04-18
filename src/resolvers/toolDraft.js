import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    toolDraft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.toolDraftSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
