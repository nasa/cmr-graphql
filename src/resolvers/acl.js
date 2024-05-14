import { parseResolveInfo } from 'graphql-parse-resolve-info'
import camelcaseKeys from 'camelcase-keys'
import { handlePagingParams } from '../utils/handlePagingParams'
import { parseRequestedFields } from '../utils/parseRequestedFields'

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
  },

  Acl: {
    groupPermissions: async (source) => {
      const { groupPermissions } = source

      const camelcasedData = camelcaseKeys(groupPermissions, { deep: true })

      return {
        groupPermission: camelcasedData
      }
    },

    catalogItemIdentity: async (source) => {
      const { catalogItemIdentity } = source

      const camelcasedData = camelcaseKeys(catalogItemIdentity, { deep: true })

      const {
        collectionApplicable,
        collectionIdentifier,
        granuleApplicable,
        granuleIdentifier,
        name,
        providerId
      } = camelcasedData

      return {
        collectionApplicable,
        collectionIdentifier,
        granuleApplicable,
        granuleIdentifier,
        name,
        providerId
      }
    }

  },
  GroupPermission: {
    group: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')

      const { jsonKeys } = requestInfo

      const { groupId: id } = source

      if (!id) {
        return null
      }

      // If only id field is requested, returns the groupId from the previous result
      if (jsonKeys.includes('id') && jsonKeys.length === 1) {
        return { id }
      }

      return dataSources.groupSourceFetch(
        { id },
        context,
        requestInfo
      )
    }
  },

  CollectionIdentifier: {
    collections: async (source, args, context, info) => {
      const { dataSources } = context
      const { conceptIds } = source

      if (conceptIds.length === 0) {
        return null
      }

      const requestedParams = handlePagingParams({
        conceptId: conceptIds,
        ...args
      })

      return dataSources.collectionSourceFetch(requestedParams, context, parseResolveInfo(info))
    }
  }
}
