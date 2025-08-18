import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

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
    },

    collections: async (source, args, context, info) => {
      const { dataSources } = context

      const {
        associationDetails = {},
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'citation')) return null

      // Find the associated collections
      const { collections = [] } = associationDetails

      // If there are no associations to collections for this citation
      if (!collections.length) {
        return {
          count: 0,
          items: []
        }
      }

      const collectionConceptIds = collections.map((collection) => collection.conceptId)

      const requestedParams = handlePagingParams({
        conceptId: collectionConceptIds,
        ...args
      })

      return dataSources.collectionSourceFetch(requestedParams, context, parseResolveInfo(info))
    }
  }
}
