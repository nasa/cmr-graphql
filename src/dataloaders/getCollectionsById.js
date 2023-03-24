import { handlePagingParams } from '../utils/handlePagingParams'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'

/**
 * Requests a batch of collections provided their concept ids
 * @param {Object} params
 * @param {String} params.conceptId Concept ID that is being searched on.
 * @param {Object} params.context Context object created and provided by Apollo Server.
 * @param {String} params.parsedInfo Parsed information pertaining to the client query.
 */
export const getCollectionsById = async (collections) => {
  const [firstCollection] = collections

  // In order to utilize the concept classes we need to request
  // the context and parsedInfo from the client query alongside
  // the conceptId but since we're batching this request we'll
  // take the context and parsedInfo from the first collection
  // because they will be the same for each record
  const { context, parsedInfo } = firstCollection

  // Pull out headers from the context to send relevant values along with our request
  const { headers } = context

  // Parse the client query for information that will help make decisions about what to request
  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const conceptIds = collections.map((collection) => collection.conceptId)

  // Instantiate a Collection concept to perform our request
  const collection = new Collection(
    headers,
    requestInfo,
    handlePagingParams({
      conceptId: conceptIds,
      limit: collections.length
    })
  )

  // Query CMR
  collection.fetch(
    handlePagingParams({
      conceptId: conceptIds,
      limit: collections.length
    }),
    context
  )

  // Parse the response from CMR
  await collection.parse(requestInfo)

  // Return a formatted JSON response
  const returnedCollections = collection.getFormattedResponse()

  // Fix the resulting collections return order to match incoming list
  return conceptIds.reduce((orderedCollections, conceptId) => {
    const sortedCollection = returnedCollections.find(
      (returnedCollection) => returnedCollection.conceptId === conceptId
    )

    if (!sortedCollection) {
      throw new Error(`No collection returned with conceptId [${conceptId}]`)
    }

    return [...orderedCollections, sortedCollection]
  }, [])
}
