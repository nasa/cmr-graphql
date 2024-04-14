import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Mutation: {
    createAssociation: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.associationSourceCreate(
        args,
        context,
        parseResolveInfo(info)
      )
    },

    deleteAssociation: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.associationSourceDelete(
        args,
        context,
        parseResolveInfo(info)
      )
    }
  }
}
