import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    granules: async (source, args, { dataSources, token }, info) => {
      const {
        collection_concept_id: collectionConceptId,
        concept_id: conceptId,
        first: pageSize
      } = args

      return dataSources.granuleSource({
        concept_id: conceptId,
        collection_concept_id: collectionConceptId,
        page_size: pageSize
      }, token, parseResolveInfo(info))
    },
    granule: async (source, args, { dataSources, token }, info) => {
      const { concept_id: conceptId } = args

      const result = await dataSources.granuleSource({
        concept_id: conceptId
      }, token, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
