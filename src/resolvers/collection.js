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
      const { concept_id: collectionId } = source

      return dataSources.granuleSource(
        handlePagingParams({
          collection_concept_id: collectionId,
          ...args
        }), headers, parseResolveInfo(info)
      )
    },
    services: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { services = [] } = associations

      if (!services.length) return []

      return dataSources.serviceSource({
        concept_id: services,
        ...handlePagingParams(args, services.length)
      }, headers, parseResolveInfo(info))
    },
    variables: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { variables = [] } = associations

      if (!variables.length) return []

      return dataSources.variableSource({
        concept_id: variables,
        ...handlePagingParams(args, variables.length)
      }, headers, parseResolveInfo(info))
    }
  }
}
