import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    tagDefinitions: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.tagDefinitionSource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    }
  }
}
