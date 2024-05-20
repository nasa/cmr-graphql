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
    groups: async (source, args, context, info) => {
      const { dataSources } = context
      const resolvedInfo = parseResolveInfo(info)
      const requestInfo = parseRequestedFields(resolvedInfo, {}, 'aclGroup')

      const { groups } = source

      const aclGroupResponse = camelcaseKeys(groups, { deep: true })

      const groupIds = []

      // Checks to see if there are groupId
      Object.values(aclGroupResponse).forEach((value) => {
        const { groupId, userType } = value

        if (groupId && !userType) {
          groupIds.push(groupId)
        }
      })

      if (groupIds.length > 0) {
        // Gets all groups from EDL
        const result = await dataSources.groupSourceSearch(
          { name: '' },
          context,
          requestInfo
        )

        const filteredData = result.items.filter((item) => groupIds.includes(item.id))

        // Creates a map based on groupId
        const edlResponseMap = new Map()
        filteredData.forEach((item) => {
          edlResponseMap.set(item.id, item)
        })

        // Combine the arrays based on matching groupId
        const combinedGroupResponse = aclGroupResponse.map((item) => {
          if (item.groupId && edlResponseMap.has(item.groupId)) {
            return {
              ...item,
              ...edlResponseMap.get(item.groupId)
            }
          }

          return item
        })

        return {
          count: combinedGroupResponse.length,
          items: combinedGroupResponse
        }
      }

      return {
        count: aclGroupResponse.length,
        items: aclGroupResponse
      }
    },

    catalogItemIdentity: async (source) => {
      const { catalogItemIdentity } = source

      const camelcasedData = camelcaseKeys(catalogItemIdentity, { deep: true })

      const {
        collectionApplicable,
        collectionIdentifier,
        granuleApplicable,
        granuleIdentifier
      } = camelcasedData

      const { conceptIds } = collectionIdentifier || {}

      if (conceptIds) {
        delete collectionIdentifier.conceptIds
        delete collectionIdentifier.entryTitles
      }

      return {
        collectionApplicable,
        collectionIdentifier,
        granuleApplicable,
        granuleIdentifier
      }
    },

    collections: async (source, args, context, info) => {
      const { catalogItemIdentity } = source

      const { dataSources } = context

      if (!catalogItemIdentity) {
        return null
      }

      const camelcasedData = camelcaseKeys(catalogItemIdentity, { deep: true })

      const { collectionIdentifier } = camelcasedData

      const { conceptIds } = collectionIdentifier

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
