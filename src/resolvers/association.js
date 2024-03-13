import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Mutation: {
    createAssociation: async (source, args, context, info) => {
      const { dataSources } = context

      const { conceptType } = args

      if (conceptType === 'Variable') {
        const result = await dataSources.variableAssociationSourceCreate(
          args,
          context,
          parseResolveInfo(info)
        )

        return result
      }

      const result = await dataSources.associationSourceCreate(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    }
  }
}
