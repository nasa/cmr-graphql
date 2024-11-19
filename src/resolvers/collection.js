import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'
import { isDraftConceptId } from '../utils/isDraftConceptId'

export default {
  Query: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.collectionSourceFetch(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    collection: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.collectionSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    restoreCollectionRevision: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.collectionSourceRestoreRevision(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },

    deleteCollection: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.collectionSourceDelete(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  },

  Collection: {
    revisions: async (source, args, context, info) => {
      const { dataSources } = context

      const { conceptId } = source

      return dataSources.collectionSourceFetch(
        {
          conceptId,
          allRevisions: true
        },
        context,
        parseResolveInfo(info)
      )
    },

    granules: async (source, args, context, info) => {
      const { dataSources } = context

      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        conceptId: collectionId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(collectionId, 'collection')) return null

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

      const { conceptId } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'collection')) return null

      return dataSources.graphDbSource(source, args, context, parseResolveInfo(info))
    },
    generateVariableDrafts: async (source, args, context) => {
      const { conceptId } = source

      const { dataSources } = context

      return dataSources.collectionVariableDraftsSource({ conceptId }, context, parseResolveInfo)
    },
    dataQualitySummaries: async (source, args, context, info) => {
      const {
        associationDetails = {},
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'collection')) return null

      const { dataSources } = context

      const { dataQualitySummaries = [] } = associationDetails

      const dataQualitySummaryConceptIds = dataQualitySummaries.map(
        ({ conceptId: dqsId }) => dqsId
      )

      if (!dataQualitySummaryConceptIds.length) {
        return {
          count: 0,
          items: []
        }
      }

      return dataSources.dataQualitySummarySource({
        conceptId: dataQualitySummaryConceptIds,
        ...handlePagingParams(args, dataQualitySummaryConceptIds.length)
      }, context, parseResolveInfo(info))
    },
    duplicateCollections: async (source, args, context) => {
      const { dataSources } = context

      const { conceptId } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'collection')) return null

      return dataSources.graphDbDuplicateCollectionsSource(source, context)
    },
    services: async (source, args, context, info) => {
      const {
        associationDetails = {},
        conceptId: collectionConceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(collectionConceptId, 'collection')) return null

      const { dataSources } = context

      const { services = [] } = associationDetails

      const serviceConceptIds = services.map(({ conceptId }) => conceptId)

      if (!services.length) {
        return {
          count: 0,
          items: []
        }
      }

      return dataSources.serviceSourceFetch(
        {
          conceptId: serviceConceptIds,
          ...handlePagingParams(args, services.length)
        },
        context,
        parseResolveInfo(info),
        // Pass the collection's concept-id to child queries over associated services
        collectionConceptId
      )
    },
    subscriptions: async (source, args, context, info) => {
      // Pull out parent collection id
      const {
        conceptId: collectionId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(collectionId, 'collection')) return null

      const { dataSources } = context

      return dataSources.subscriptionSourceFetch({
        collectionConceptId: collectionId,
        ...handlePagingParams(args)
      }, context, parseResolveInfo(info))
    },
    tagDefinitions: async (source, args, context, info) => {
      const { dataSources } = context
      const { tags } = source

      if (!tags) {
        return null
      }

      const requestedParams = handlePagingParams({
        tagKey: Object.keys(tags)
      })

      return dataSources.tagDefinitionSource(
        requestedParams,
        context,
        parseResolveInfo(info)
      )
    },
    tools: async (source, args, context, info) => {
      const {
        associationDetails = {},
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'collection')) return null

      const { dataSources } = context

      const { tools = [] } = associationDetails

      const toolConceptIds = tools.map(({ conceptId: toolId }) => toolId)

      if (!tools.length) {
        return {
          count: 0,
          items: []
        }
      }

      return dataSources.toolSourceFetch({
        conceptId: toolConceptIds,
        ...handlePagingParams(args)
      }, context, parseResolveInfo(info))
    },
    variables: async (source, args, context, info) => {
      const {
        associationDetails = {},
        conceptId
      } = source

      // If the concept being returned is a draft, there will be no associations,
      // return null to avoid an extra call to CMR
      if (isDraftConceptId(conceptId, 'collection')) return null

      const { dataSources } = context

      const { variables = [] } = associationDetails

      const variableConceptIds = variables.map(({ conceptId: variableId }) => variableId)

      if (!variables.length) {
        return {
          count: 0,
          items: []
        }
      }

      return dataSources.variableSourceFetch({
        conceptId: variableConceptIds,
        ...handlePagingParams(args)
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
