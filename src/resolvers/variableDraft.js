import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    variableDraft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.variableDraftSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  VariableDraftList: {
    count: (source) => Object.keys(source).length,
    items: (source) => source
  }
}
