export default {
  Query: {
    services: async (source, args, { dataSources, token }) => {
      const { id, pageSize } = args

      return dataSources.serviceSource({
        id,
        pageSize
      }, token)
    },
    service: async (source, args, { dataSources }) => {
      const { id } = args

      const result = await dataSources.serviceSource(id)

      const [firstResult] = result

      return firstResult
    }
  }
}
