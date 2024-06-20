import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { parseRequestedFields } from '../utils/parseRequestedFields'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    groups: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')

      return dataSources.groupSourceSearch(
        args,
        context,
        requestInfo
      )
    },

    group: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')

      return dataSources.groupSourceFetch(
        args,
        context,
        requestInfo
      )
    }
  },

  Mutation: {
    createGroup: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')

      return dataSources.groupSourceCreate(
        args,
        context,
        requestInfo
      )
    },

    deleteGroup: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')

      return dataSources.groupSourceDelete(
        args,
        context,
        requestInfo
      )
    },

    updateGroup: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')

      return dataSources.groupSourceUpdate(
        args,
        context,
        requestInfo
      )
    }
  },

  Group: {
    members: async (source, args, context, info) => {
      const { groupId } = source

      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'groupMember')

      return dataSources.groupSourceListMembers(
        { id: groupId },
        context,
        requestInfo
      )
    },

    acls: async (source, args, context, info) => {
      const { groupId } = source

      const { dataSources } = context

      return dataSources.aclSourceFetch(
        handlePagingParams({
          ...args,
          permittedGroup: groupId
        }),
        context,
        parseResolveInfo(info)
      )
    }
  }
}
