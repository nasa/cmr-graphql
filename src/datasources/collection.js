import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'

export const fetchCollections = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const collection = new Collection(headers, requestInfo, params)

  // Query CMR
  collection.fetch(params)

  // Parse the response from CMR
  await collection.parse(requestInfo)

  // Return a formatted JSON response
  return collection.getFormattedResponse()
}

export const deleteCollection = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const {
    ingestKeys
  } = requestInfo

  const collection = new Collection(headers, requestInfo, args)

  // Query CMR
  collection.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await collection.parseDelete(requestInfo)

  // Return a formatted JSON response
  return collection.getFormattedDeleteResponse()
}
