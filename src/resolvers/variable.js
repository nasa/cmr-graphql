export default {
  Query: {
    variables: async (source, args, { dataSources, token }) => {
      const { id, pageSize } = args

      return dataSources.variableSource({
        id,
        pageSize
      }, token)
    },
    variable: async (source, args, { dataSources, token }) => {
      const { id } = args

      const result = await dataSources.variableSource(id, token)

      const [firstResult] = result

      return firstResult
    }
  }
}
