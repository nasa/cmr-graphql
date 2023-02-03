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
      const {
        associationDetails = {}
      } = source

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
    },
    // Filter the returned order-options by the concept-id passed into the service's query parent collection
    associatedOrderOptions: async (source, args, context, info) => {
      const {
        associationDetails = {}
      } = source
      console.log('these are the current association details', associationDetails)
      const { dataSources } = context

      const { collections = [] } = associationDetails
      // Retrieve any collection-concept-id that may be being passed as a parameter
      const { variableValues } = info

      const { params: { conceptId: collectionConceptId } = {} } = variableValues

      let assocCollections = collections
      // TODO: don't filter if there is not a collection being passed as a parameter
      if (collectionConceptId) {
        console.log('a collection concept-id was passed down it was', collectionConceptId)
        // eslint-disable-next-line max-len
        assocCollections = collections.filter((assoc) => collectionConceptId.includes(assoc.conceptId))
      }
      console.log('these are the current collections after they are filtered', assocCollections)
      // eslint-disable-next-line max-len
      // assocCollections = collections.filter((assoc) => collectionConceptId.includes(assoc.conceptId))

      const associationPayloads = assocCollections.map(({ data = {} }) => data)
      // if there are no associations there will not be any order-top
      // if (!associationPayloads.length) {
      //   return {
      //     count: 0,
      //     items: null
      //   }
      // }

      const orderOptionConceptIds = associationPayloads.map(({ orderOption }) => orderOption)
      console.log('these are the current order-options', orderOptionConceptIds)
      console.log(orderOptionConceptIds.length)

      if (orderOptionConceptIds[0] === undefined) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.orderOptionSource({
        conceptId: orderOptionConceptIds,
        ...handlePagingParams(args, orderOptionConceptIds.length)
      }, context, parseResolveInfo(info))
    }
  }
}
