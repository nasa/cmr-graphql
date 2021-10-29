import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Query: {
    collectionDraftProposal: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.collectionDraftProposalSource(
        args,
        headers,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  }
}
