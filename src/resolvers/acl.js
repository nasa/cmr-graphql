import { parseResolveInfo } from 'graphql-parse-resolve-info'

import camelcaseKeys from 'camelcase-keys'

import isEmpty from 'lodash/isEmpty'

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

      const sourceKeys = ['id', 'permissions', 'userType']

      const { jsonKeys } = requestInfo

      // If all the keys requested are in the source, return the source
      if (jsonKeys.every((requestedKey) => sourceKeys.includes(requestedKey))) {
        return {
          count: aclGroupResponse.length,
          items: aclGroupResponse.map((group) => {
            const { groupId, ...originalGroup } = group

            if (groupId) {
              return {
                ...originalGroup,
                id: groupId
              }
            }

            return originalGroup
          })
        }
      }

      const groupIds = aclGroupResponse
        .filter((groupResponse) => groupResponse.groupId && groupResponse.userType == null)
        .map((groupResponse) => groupResponse.groupId)

      const params = {
        params: {
          limit: 1000,
          name: ''
        }
      }

      if (groupIds.length > 0) {
        // Gets all groups from EDL
        const result = await dataSources.groupSourceSearch(
          params,
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

      /*
        When the group only has permission and userType
        [
          { permissions: [ 'read' ], userType: 'guest' },
          { permissions: [ 'read' ], userType: 'registered' }
        ]
      */
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
        granuleIdentifier,
        providerId
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
        granuleIdentifier,
        providerId
      }
    },

    collections: async (source, args, context, info) => {
      const { catalogItemIdentity } = source

      if (isEmpty(catalogItemIdentity)) {
        return null
      }

      const { dataSources } = context

      const camelcasedData = camelcaseKeys(catalogItemIdentity, { deep: true })

      const { collectionIdentifier } = camelcasedData

      if (isEmpty(collectionIdentifier)) {
        return null
      }

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
