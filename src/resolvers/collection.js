import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    collections: async (source, args, { dataSources, headers }, info) => (
      dataSources.collectionSource(
        handlePagingParams(args), headers, parseResolveInfo(info)
      )
    ),
    collection: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.collectionSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Collection: {
    granules: async (source, args, { dataSources, headers }, info) => {
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

          // TODO: This will only work for string values, it will need to be updated if we need to support arrays
          const { value: argumentValue } = value

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

      return dataSources.granuleSource(requestedParams, headers, parseResolveInfo(info))
    },
    documentedWith: async (source, args, { dataSources, headers }) => {
      const { conceptId } = source
      const { groupBy } = args

      return dataSources.graphDbSource(
        conceptId,
        'documentedWith',
        args,
        headers,
        groupBy
      )
    },
    campaignedWith: async (source, args, { dataSources, headers }) => {
      const { conceptId } = source
      const { groupBy } = args

      return dataSources.graphDbSource(
        conceptId,
        'campaignedWith',
        args,
        headers,
        groupBy
      )
    },
    acquiredWith: async (source, args, { dataSources, headers }) => {
      const { conceptId } = source
      const { groupBy } = args

      return dataSources.graphDbSource(
        conceptId,
        'acquiredWith',
        args,
        headers,
        groupBy
      )
    },
    services: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { services = [] } = associations

      if (!services.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.serviceSource({
        conceptId: services,
        ...handlePagingParams(args, services.length)
      }, headers, parseResolveInfo(info))
    },
    subscriptions: async (source, args, { dataSources, headers }, info) => {
      // Pull out parent collection id
      const {
        conceptId: collectionId
      } = source

      return dataSources.subscriptionSourceFetch({
        collectionConceptId: collectionId,
        ...handlePagingParams(args)
      }, headers, parseResolveInfo(info))
    },
    tools: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { tools = [] } = associations

      if (!tools.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.toolSource({
        conceptId: tools,
        ...handlePagingParams(args, tools.length)
      }, headers, parseResolveInfo(info))
    },
    variables: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { variables = [] } = associations

      if (!variables.length) {
        return {
          count: 0,
          items: null
        }
      }

      return dataSources.variableSource({
        conceptId: variables,
        ...handlePagingParams(args, variables.length)
      }, headers, parseResolveInfo(info))
    }
  },
  RelationshipGroupUnion: {
    __resolveType: (object) => {
      // When a RelationshipGroupUnion object is requested, this resolver will determine which of the available types the data matches and return that type
      if (object.type === 'documentedWith') {
        return 'GraphDbDocumentation'
      }
      if (object.type === 'campaignedWith') {
        return 'GraphDbCampaign'
      }
      if (object.type === 'acquiredWith') {
        return 'GraphDbPlatformInstrument'
      }

      if (object.type === 'collection') {
        return 'GraphDbCollection'
      }

      return null
    }
  }
}
