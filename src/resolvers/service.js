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

      // const { parentCollectionConceptId } = source
      // console.log('The entire source object in the orderOption/Service', source)

      console.log('This is the collection in its final destination', parentCollectionConceptId)

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
      // console.log('collections list BEFORE filter', collections)
      // eslint-disable-next-line max-len
      const filteredCollections = collections.find((col) => col.conceptId === parentCollectionConceptId)

      // console.log('collections list AFTER filter', collections)
      // sometimes this is passing cannot read properties of undefined

      const { data = {} } = filteredCollections
      // TODO: is this check necessary
      // if (!data) {
      //   return {
      //     count: 0,
      //     items: null
      //   }
      // }
      // TODO: This should need to be "order_option" that is what the response gives
      // There can be one, and only one order_option in the association payload due to valid JSON rules regarding duplicate keys
      // This key is being changed from order_option in the CMR response
      // console.log('This is the data payload', data)
      const { orderOption: orderOptionConceptId } = data

      if (!orderOptionConceptId) {
        // console.log('the concept id of the parent with the messed up payload', parentCollectionConceptId)
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
