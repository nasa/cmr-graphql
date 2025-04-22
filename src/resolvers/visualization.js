import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
  Query: {
    visualizations: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.visualizationSourceFetch(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    visualization: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.visualizationSourceFetch(
        args,
        context,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    restoreVisualizationRevision: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.visualizationSourceRestoreRevision(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },

    deleteVisualization: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.visualizationSourceDelete(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  },

  Visualization: {
    revisions: async (source, args, context, info) => {
      const { dataSources } = context

      const { conceptId } = source

      return dataSources.visualizationSourceFetch(
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
      if (isDraftConceptId(conceptId, 'visualization')) return null

      // Find the associated collections
      const { collections = [] } = associationDetails

      // If there are no associations to collections for this order option
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
