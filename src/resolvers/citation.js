import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    citations: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.citationSourceFetch(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    citation: async (source, args, context, info) => {
      const { dataSources } = context
      const result = await dataSources.citationSourceFetch(
        args,
        context,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    restoreCitationRevision: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.citationSourceRestoreRevision(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },

    deleteCitation: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.citationSourceDelete(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  },

  Citation: {
    revisions: async (source, args, context, info) => {
      const { dataSources } = context

      const { conceptId } = source

      return dataSources.citationSourceFetch(
        {
          conceptId,
          allRevisions: true
        },
        context,
        parseResolveInfo(info)
      )
    }
  }
}
