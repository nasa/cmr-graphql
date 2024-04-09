import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    acls: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.aclSourceFetch(handlePagingParams(args), context, parseResolveInfo(info))
    },
    acl: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.aclSourceFetch(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    createAcl: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.aclSourceCreate(args, context, parseResolveInfo(info))
    },

    updateAcl: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.aclSourceUpdate(args, context, parseResolveInfo(info))
    },

    deleteAcl: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.aclSourceDelete(args, context, parseResolveInfo(info))
    }
  }
}
