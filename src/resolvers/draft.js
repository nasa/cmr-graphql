import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Mutation: {
    ingestDraft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.draftSourceIngest(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    },
    deleteDraft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.draftSourceDelete(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    }
  },
  Query: {
    draft: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await
      dataSources.draftSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    },
    drafts: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.draftSourceFetch(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  },
  DraftMetadata: {
    __resolveType: (source) => {
      const { conceptId } = source

      if (conceptId.startsWith('CD')) return 'Collection'
      if (conceptId.startsWith('SD')) return 'Service'
      if (conceptId.startsWith('TD')) return 'Tool'
      if (conceptId.startsWith('VD')) return 'Variable'

      return null
    }
  }
}
