import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    subscriptions: async (source, args, { dataSources, headers }, info) => (
      dataSources.subscriptionSourceFetch(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    subscription: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.subscriptionSourceFetch(
        args,
        headers,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  },

  Subscription: {
    collection: async (source, args, { dataSources, headers }, info) => {
      // Pull out parent collection id to provide to the granules endpoint because cmr requires it
      const {
        collectionConceptId
      } = source

      // If the subscription doesn't have a collectionConceptId, like when the type requested was `collection`
      // return null for the collection
      if (!collectionConceptId) return null

      const requestedParams = handlePagingParams({
        conceptId: collectionConceptId,
        ...args
      })

      const result = await dataSources.collectionSource(
        requestedParams,
        headers,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    createSubscription: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.subscriptionSourceIngest(
        args,
        headers,
        parseResolveInfo(info)
      )

      return result
    },
    updateSubscription: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.subscriptionSourceIngest(
        args,
        headers,
        parseResolveInfo(info)
      )

      return result
    },
    deleteSubscription: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.subscriptionSourceDelete(
        args,
        headers,
        parseResolveInfo(info)
      )

      return result
    }
  }
}
