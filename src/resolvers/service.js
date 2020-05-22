import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    services: async (source, args, { dataSources, headers }, info) => {
      const { concept_id: conceptId, first: pageSize } = args

      return dataSources.serviceSource({
        concept_id: conceptId,
        page_size: pageSize
      }, headers, parseResolveInfo(info))
    },
    service: async (source, args, { dataSources, headers }, info) => {
      const { concept_id: conceptId } = args

      const result = await dataSources.serviceSource({
        concept_id: conceptId
      }, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
