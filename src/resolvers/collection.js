import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.collectionSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    collection: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.collectionSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Collection: {
    granules: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId: collectionId
      } = source

      // Empty object that will contain the search parameters sent to CMR
      const granuleParams = {}

      // If filtering parameters were supplied to the collection query it is expected
      // that the granules will also be filtered by those same conditions
      const passthroughParams = [
        'boundingBox',
        'circle',
        'point',
        'polygon',
        'temporal'
      ]

      // Pull out arguments for the top level operation provided in the info so that we can
      // pass through filtering arguments to granules
      const { operation } = info
      const { selectionSet } = operation
      const { selections } = selectionSet

      selections.forEach((selection) => {
        const { arguments: selectionArguments } = selection

        selectionArguments.forEach((selectionArgument) => {
          const { name, value } = selectionArgument

          const { value: argumentName } = name

          const { value: argumentValue } = value

          // TODO: This will only work for string values, it will need to be updated if we need to support arrays
          if (passthroughParams.includes(argumentName)) {
            granuleParams[argumentName] = argumentValue
          }
        })
      })

      // Splat granuleParams before args to allow for overwriting granuleParams
      const requestedParams = handlePagingParams({
        collectionConceptId: collectionId,
        ...granuleParams,
        ...args
      })

      return dataSources.granuleSource(requestedParams, context, parseResolveInfo(info))
    },
    relatedCollections: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.graphDbSource(source, args, context, parseResolveInfo(info))
    },
    duplicateCollections: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.graphDbDuplicateCollectionsSource(source, context)
    },
    services: async (source, args, context, info) => {
      const {
        associationDetails = {}
      } = source

      // const { conceptId: collectionConceptId = {} } = source
      // console.log('the collection concept-id from the service', collectionConceptId)

      const { dataSources } = context

      const { services = [] } = associationDetails

      const serviceConceptIds = services.map(({ conceptId }) => conceptId)

      // const associationPayloads = services.map(({ data }) => data)
      // Pull the order-options out of this
      // TODO: I don't understand how this is getting pared as a
      // const orderOptionConceptIds = associationPayloads.map(({ orderOption }) => orderOption)

      if (!services.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.serviceSource({
        conceptId: serviceConceptIds,
        ...handlePagingParams(args, services.length)
      }, context, parseResolveInfo(info))

      // Put in the order-option
    },
    subscriptions: async (source, args, context, info) => {
      // Pull out parent collection id
      const {
        conceptId: collectionId
      } = source

      const { dataSources } = context

      return dataSources.subscriptionSourceFetch({
        collectionConceptId: collectionId,
        ...handlePagingParams(args)
      }, context, parseResolveInfo(info))
    },
    tools: async (source, args, context, info) => {
      const {
        associationDetails = {}
      } = source

      const { dataSources } = context

      const { tools = [] } = associationDetails

      const toolConceptIds = tools.map(({ conceptId }) => conceptId)

      if (!tools.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.toolSource({
        conceptId: toolConceptIds,
        ...handlePagingParams(args, tools.length)
      }, context, parseResolveInfo(info))
    },
    variables: async (source, args, context, info) => {
      const {
        associationDetails = {}
      } = source

      const { dataSources } = context

      const { variables = [] } = associationDetails

      const variableConceptIds = variables.map(({ conceptId }) => conceptId)

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
    // These are going to be the order-options which are associated to the service associated to the collection
    relatedOrderOptions: async (source, args, context, info) => {
      const {
        associationDetails = {}
      } = source

      const { dataSources } = context

      const { services = [] } = associationDetails
      // TODO: rename this var
      // const { data = {} } = services
      // TODO: for all of the order_options in this association we grab the
      // one in the payload
      // then we just pass that to the datasource for order-options to get those back

      const serviceConceptIds = services.map(({ conceptId }) => conceptId)
      console.log('the services', serviceConceptIds)
      // TODO: This needs to have a null case
      const associationPayloads = services.map(({ data }) => data)

      console.log('payloads for col to service', associationPayloads)
      // Pull the order-options out of this
      // TODO: I don't understand how this is getting pared as a
      const orderOptionConceptIds = associationPayloads.map(({ orderOption }) => orderOption)

      // const { orderOptions = [] } = associationDetails

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
    }
  },
  Relationship: {
    __resolveType: (object) => {
      // Return what the GraphQL Type of the given object by looking for specific properties
      if (object.relationshipType === 'relatedUrl') {
        return 'GraphDbRelatedUrl'
      }

      if (object.relationshipType === 'project') {
        return 'GraphDbProject'
      }

      if (object.relationshipType === 'platformInstrument') {
        return 'GraphDbPlatformInstrument'
      }

      return null
    }
  }
}
