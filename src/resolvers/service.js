import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    services: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.serviceSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    service: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.serviceSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Service: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context
      console.log('The source for the service', source)

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      const requestedParams = handlePagingParams({
        serviceConceptId: conceptId,
        ...args
      })

      return dataSources.collectionSource(requestedParams, context, parseResolveInfo(info))
    },
    orderOptions: async (source, args, context, info) => {
      const {
        associationDetails = {}
      } = source

      console.log('The source for the service', source)
      // console.log('The context for the service', context)
      // console.log('The info for the service', info)
      // console.log('The args for the service', args)

      const { dataSources } = context

      const { orderOptions = [] } = associationDetails

      const orderOptionConceptIds = orderOptions.map(({ conceptId }) => conceptId)

      if (!orderOptions.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.orderOptionSource({
        conceptId: orderOptionConceptIds,
        ...handlePagingParams(args, orderOptions.length)
      }, context, parseResolveInfo(info))
    }
  }
}
