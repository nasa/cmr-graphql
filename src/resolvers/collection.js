export default {
  Query: {
    collections: async (source, args, { dataSources, token }) => {
      const { id, pageSize } = args

      return dataSources.collectionSource({
        id,
        pageSize
      }, token)
    },
    collection: async (source, args, { dataSources, token }) => {
      const { id } = args

      const result = await dataSources.collectionSource({
        id
      }, token)

      const [firstResult] = result

      return firstResult
    }
  },

  Collection: {
    granules: async (source, args, { dataSources, token }) => {
      const { id: collectionId } = source

      const { pageSize } = args

      return dataSources.granuleSource({
        id: collectionId,
        pageSize
      }, token)
    },
    services: async (source, args, { dataSources, token }) => {
      const {
        associations = {}
      } = source

      const { services = [] } = associations

      const { pageSize } = args

      return dataSources.serviceSource({
        id: services,
        pageSize
      }, token)
    },
    variables: async (source, args, { dataSources, token }) => {
      const {
        associations = {}
      } = source

      const { variables = [] } = associations

      const { pageSize } = args

      return dataSources.variableSource({
        id: variables,
        pageSize
      }, token)
    }
  }
}
