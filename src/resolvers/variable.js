import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
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

  Mutation: {
    deleteVariable: async (source, args, context, info) => {
      const { dataSources } = context
      console.log(args)

      return dataSources.variableSourceDelete(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
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

      return dataSources.collectionSource(requestedParams, context, parseResolveInfo(info))
    }
  }
}
