import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    services: async (source, args, { dataSources, token }, info) => {
      const { concept_id: conceptId, first: pageSize } = args

      return dataSources.serviceSource({
        concept_id: conceptId,
        first: pageSize
      }, token, parseResolveInfo(info))
    },
    service: async (source, args, { dataSources, token }, info) => {
      const { concept_id: conceptId } = args

      const result = await dataSources.serviceSource({
        concept_id: conceptId
      }, token, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
