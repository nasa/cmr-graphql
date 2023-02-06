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
      const { dataSources } = context

      // Pull out the service's parent collection id to filter the associated orderOptions only to those collections

      const {
        associationDetails = {},
        parentCollectionConceptId
      } = source

      // order-options on the payload are only in the context of the collection to service association
      if (!parentCollectionConceptId) {
        return {
          count: 0,
          items: null
        }
      }

      const { collections = [] } = associationDetails
      // If there are no associations to collections for this service
      if (!collections.length) {
        return {
          count: 0,
          items: null
        }
      }

      const filteredCollections = collections.find(
        (col) => col.conceptId === parentCollectionConceptId
      )

      const { data = {} } = filteredCollections

      const { orderOption: orderOptionConceptId } = data

      if (!orderOptionConceptId) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.orderOptionSource({
        conceptId: orderOptionConceptId,
        ...handlePagingParams(args, orderOptionConceptId.length)
      }, context, parseResolveInfo(info))
    }
  }
}
