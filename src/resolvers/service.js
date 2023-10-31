import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
  Query: {
    services: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.serviceSourceFetch(
        handlePagingParams(args),
        context,

        parseResolveInfo(info)
      )
    },
    service: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.serviceSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    deleteService: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.serviceSourceDelete(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  },

  Service: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'service')) return null

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
        conceptId,
        parentCollectionConceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'service')) return null

      const { collections = [] } = associationDetails
      // If there are no associations to collections for this service
      if (!collections.length) {
        return {
          count: 0,
          items: null
        }
      }

      let filteredCollections = collections

      // Order-options on the payload may be in under context of a specific collection to service association if a parent col was provided
      if (parentCollectionConceptId) {
        filteredCollections = collections.filter(
          (assoc) => assoc.conceptId.includes(parentCollectionConceptId)
        )
      }

      // Grab the data field for each collection association
      const associationPayloads = filteredCollections.map(({ data = {} }) => data)

      // Only add the data payloads to the list if they have an orderOption field
      const filteredPayloads = associationPayloads.filter(
        (payload) => payload.orderOption
      )

      // Pull out all the orderOption concept-ds to pass to the dataSource
      const orderOptionConceptIds = filteredPayloads.map(({ orderOption }) => orderOption)

      if (!orderOptionConceptIds.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.orderOptionSource({
        conceptId: orderOptionConceptIds,
        ...handlePagingParams(args, orderOptionConceptIds.length)
      }, context, parseResolveInfo(info))
    },
    variables: async (source, args, context, info) => {
      const {
        associationDetails = {},
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'service')) return null

      const { dataSources } = context

      const { variables = [] } = associationDetails

      const variableConceptIds = variables.map(
        ({ conceptId: variableConceptId }) => variableConceptId
      )

      if (!variables.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.variableSource({
        conceptId: variableConceptIds,
        ...handlePagingParams(args, variables.length)
      }, context, parseResolveInfo(info))
    },
    maxItemsPerOrder: async (source, args, context) => {
      const {
        conceptId,
        providerId,
        type
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'service')) return null

      if (type !== 'ECHO ORDERS') return null

      // Fetch the maxItemsPerOrder from cmr-ordering
      const { dataSources } = context

      return dataSources.maxItemsPerOrderSource({ providerId }, context)
    }
  }
}
