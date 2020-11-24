import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'

export default async (params, headers, parsedInfo) => {
  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const collection = new Collection(headers, requestInfo)

  // Query CMR
  collection.fetch(params)

  // Parse the response from CMR
  await collection.parse(requestInfo)

  // Return a formatted JSON response
  return collection.getFormattedResponse()
}