export default {
  Query: {
    variables: async (source, args, { dataSources, token }) => {
      const { conceptId, pageSize } = args

      return dataSources.variableSource({
        conceptId,
        pageSize
      }, token)
    },
    variable: async (source, args, { dataSources, token }) => {
      const { conceptId } = args

      const result = await dataSources.variableSource(conceptId, token)

      const [firstResult] = result

      return firstResult
    }
  }
}
