import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    dataQualitySummaries: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.dataQualitySummarySource(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    dataQualitySummary: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await
      dataSources.dataQualitySummarySource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
}
