import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    collections: async (source, args, { dataSources, headers }, info) => {
      const {
        concept_id: conceptId,
        first: pageSize
      } = args

      return dataSources.collectionSource({
        concept_id: conceptId,
        page_size: pageSize
      }, headers, parseResolveInfo(info))
    },
    collection: async (source, args, { dataSources, headers }, info) => {
      const { concept_id: conceptId } = args

      const result = await dataSources.collectionSource({
        concept_id: conceptId
      }, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Collection: {
    granules: async (source, args, { dataSources, headers }, info) => {
      const { concept_id: collectionId } = source

      const { first: pageSize } = args

      return dataSources.granuleSource({
        collection_concept_id: collectionId,
        page_size: pageSize
      }, headers, parseResolveInfo(info))
    },
    services: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { services = [] } = associations

      if (!services.length) return []

      const { first: pageSize } = args

      return dataSources.serviceSource({
        concept_id: services,
        page_size: pageSize || services.length
      }, headers, parseResolveInfo(info))
    },
    variables: async (source, args, { dataSources, headers }, info) => {
      const {
        associations = {}
      } = source

      const { variables = [] } = associations

      if (!variables.length) return []

      const { first: pageSize } = args

      return dataSources.variableSource({
        concept_id: variables,
        page_size: pageSize || variables.length
      }, headers, parseResolveInfo(info))
    }
  }
}
