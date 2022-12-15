import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    collectionDraft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.collectionDraftSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
