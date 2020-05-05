export default {
  Query: {
    collections: async (source, args, { dataSources, headers }) => {
      const { id, page_size: pageSize } = args

      return dataSources.collectionSource({
        concept_id: id,
        page_size: pageSize
      }, headers)
    },
    collection: async (source, args, { dataSources, headers }) => {
      const { id } = args

      const result = await dataSources.collectionSource({
        concept_id: id
      }, headers)

      const [firstResult] = result

      return firstResult
    }
  },

  Collection: {
    granules: async (source, args, { dataSources, headers }) => {
      const { id: collectionId } = source

      const { page_size: pageSize } = args

      return dataSources.granuleSource({
        collection_concept_id: collectionId,
        page_size: pageSize
      }, headers)
    },
    services: async (source, args, { dataSources, headers }) => {
      const {
        associations = {}
      } = source

      const { services = [] } = associations

      if (!services.length) return []

      const { page_size: pageSize } = args

      return dataSources.serviceSource({
        concept_id: services,
        page_size: pageSize
      }, headers)
    },
    variables: async (source, args, { dataSources, headers }) => {
      const {
        associations = {}
      } = source

      const { variables = [] } = associations

      if (!variables.length) return []

      const { page_size: pageSize } = args

      return dataSources.variableSource({
        concept_id: variables,
        page_size: pageSize
      }, headers)
    }
  }
}
