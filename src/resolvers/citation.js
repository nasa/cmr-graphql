import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from "../utils/handlePagingParams";

export default {
  Query: {
    citations: async (source, args, context, info) => {
      const { dataSources } = context
      
      return dataSources.citationSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    citation: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.citationSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    deleteCitation: async (source, args, context, info) => {
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
    }
  }
}