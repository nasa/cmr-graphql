import { parseResolveInfo } from 'graphql-parse-resolve-info'

export default {
  Mutation: {
    createAssociation: async (source, args, context, info) => {
      const { dataSources } = context

      const { conceptType, nativeId, metadata } = args

      // Checks if nativeId and metadata are present when creating a Variable Association
      if (conceptType === 'Variable' && (!nativeId || !metadata)) {
        throw new Error('nativeId and metadata required. When creating a Variable Association, nativeId and metadata are required')
      }

      // Checks if nativeId or metadata are present when creating a Tool or Service Association
      if (conceptType !== 'Variable' && (nativeId || metadata)) {
        throw new Error('nativeId or metadata are invalid fields. When creating a Tool or Service Association, nativeId and metadata are not valid field')
      }

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
    },

    deleteAssociation: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.associationSourceDelete(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    }
  }
}
