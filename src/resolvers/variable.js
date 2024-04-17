import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
  Mutation: {
    publishGeneratedVariables: async (source, args, context, info) => {
      const { conceptId } = args

      const { dataSources } = context

      const results = await dataSources.collectionVariableDraftsSource({
        conceptId,
        publish: true
      }, context, parseResolveInfo)

      // Pull out the variable concept ids from the source to use as parameters later
      const conceptIds = {
        params: { conceptId: results.map((item) => item.conceptId) }
      }

      return dataSources.variableSourceFetch(
        handlePagingParams(conceptIds),
        context,
        parseResolveInfo(info)
      )
    },

    restoreVariableRevision: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.variableSourceRestoreRevision(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },

    deleteVariable: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.variableSourceDelete(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  },
  Query: {
    variables: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.variableSourceFetch(
        handlePagingParams(args),
        context,

        parseResolveInfo(info)
      )
    },
    variable: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.variableSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Variable: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'variable')) return null

      const requestedParams = handlePagingParams({
        variableConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSourceFetch(requestedParams, context, parseResolveInfo(info))
    }
  }
}
