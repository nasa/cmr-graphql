import { parseResolveInfo } from 'graphql-parse-resolve-info'

import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    granules: async (source, args, { dataSources, headers }, info) => (
      dataSources.granuleSource(handlePagingParams(args), headers, parseResolveInfo(info))
    ),
    granule: async (source, args, { dataSources, headers }, info) => {
      const result = await dataSources.granuleSource(args, headers, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  },
  Granule: {
    collection: async (source, args, context, info) => {
      const {
        dataSources,
        edlUsername,
        headers,
        redisClient
      } = context
      const parsedInfo = parseResolveInfo(info)

      // If collection is requested, collectionConceptId will be included in the response
      const { collectionConceptId } = source

      // Encode the parsed info, to generate a unique cacheKey
      const encodedInfo = Buffer.from(
        JSON.stringify(parsedInfo)
      ).toString('base64')

      // Generate a unique cache key for this collection/user/fields requested
      const cacheKey = `${collectionConceptId}-${edlUsername}-${encodedInfo}`

      // Search the cache for this result
      const cachedResult = await redisClient.get(cacheKey)

      // If the result has been cached, return the cachedResult
      if (cachedResult) return JSON.parse(cachedResult)

      // Perform the CMR query to retrieve the collection metadata
      const requestedParams = handlePagingParams({
        conceptId: collectionConceptId,
        ...args
      })

      // Request the collection information
      const result = await dataSources.collectionSource(
        requestedParams,
        headers,
        parsedInfo
      )

      // The collection will be the first value in the array
      const [firstResult] = result

      // Save the retrieved data in the cache, expiring after process.env.cacheKeyExpireSeconds
      await redisClient.set(cacheKey, JSON.stringify(firstResult), 'EX', parseInt(process.env.cacheKeyExpireSeconds, 10))

      return firstResult
    }
  }
}
