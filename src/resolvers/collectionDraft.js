import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    collectionDraft: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.collectionDraftSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
