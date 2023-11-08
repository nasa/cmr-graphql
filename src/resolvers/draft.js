import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

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
    },
    publishDraft: async (source, args, context, info) => {
      const { dataSources } = context
      const { draftConceptId, collectionConceptId } = args

      // Checks if collectionConceptId is present when publishing a Variable Draft
      if (isDraftConceptId(draftConceptId, 'variable') && !collectionConceptId) {
        throw new Error('collectionConceptId required')
      }

      // Checks if collectionConcept is present when publishing a non Variable draft
      if (!isDraftConceptId(draftConceptId, 'variable') && collectionConceptId) {
        throw new Error('Invalid Argument, collectionConceptId')
      }

      const result = await dataSources.draftSourcePublish(
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

      const result = await dataSources.draftSourceFetch(args, context, parseResolveInfo(info))

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
  PreviewMetadata: {
    __resolveType: (source) => {
      const { conceptId } = source

      // PreviewMetadata is a union, __resolveType is necessary to tell GraphQL which type is being returned
      // Check the source conceptId in order to determine which union type is correct.
      if (isDraftConceptId(conceptId, 'collection')) return 'Collection'
      if (isDraftConceptId(conceptId, 'service')) return 'Service'
      if (isDraftConceptId(conceptId, 'tool')) return 'Tool'
      if (isDraftConceptId(conceptId, 'variable')) return 'Variable'

      return null
    }
  }
}
