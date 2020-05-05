export default {
  Query: {
    services: async (source, args, { dataSources, token }) => {
      const { conceptId, pageSize } = args

      return dataSources.serviceSource({
        conceptId,
        pageSize
      }, token)
    },
    service: async (source, args, { dataSources }) => {
      const { conceptId } = args

      const result = await dataSources.serviceSource(conceptId)

      const [firstResult] = result

      return firstResult
    }
  }
}
