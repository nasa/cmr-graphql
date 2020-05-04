export default {
  Query: {
    granules: async (source, args, { dataSources, token }) => {
      const { id, pageSize } = args

      return dataSources.granuleSource({
        id,
        pageSize
      }, token)
    },
    granule: async (source, args, { dataSources, token }) => {
      const { id } = args

      const result = await dataSources.granuleSource(id, token)

      const [firstResult] = result

      return firstResult
    }
  }
}
