import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    subscriptions: async (source, args, context, info) => {
      const { dataSources } = context

      return dataSources.subscriptionSourceFetch(
        handlePagingParams(args),
        context,
        parseResolveInfo(info)
      )
    },
    subscription: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.subscriptionSourceFetch(
        args,
        context,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  },

  CollectionSubscription: {
    collection: async (source, args, context, info) => {
      const { dataSources } = context

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

      const result = await dataSources.collectionSourceFetch(
        requestedParams,
        context,
        parseResolveInfo(info)
      )

      const [firstResult] = result

      return firstResult
    }
  },

  Mutation: {
    createSubscription: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.subscriptionSourceIngest(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    },
    updateSubscription: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.subscriptionSourceIngest(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    },
    deleteSubscription: async (source, args, context, info) => {
      const { dataSources } = context

      const result = await dataSources.subscriptionSourceDelete(
        args,
        context,
        parseResolveInfo(info)
      )

      return result
    }
  }
}
