import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    collectionDraftProposal: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.collectionDraftProposalSource(
        args,
        context,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  }
}
