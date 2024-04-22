import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    userGroups: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.userGroupSourceSearch(
        handlePagingParams(args),
        context
      )
    },

    userGroup: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.userGroupSourceFetch(
        handlePagingParams(args),
        context
      )
    }
  },

  Mutation: {
    createUserGroup: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.userGroupSourceCreate(args, context)
    },

    deleteUserGroup: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.userGroupSourceDelete(args, context)
    },

    updateUserGroup: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.userGroupSourceUpdate(args, context)
    }
  }
}
