import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'

export default async (params, headers, parsedInfo) => {
  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const collection = new Collection(headers, requestInfo, params)

  // Query CMR
  collection.fetch(params)

  // Parse the response from CMR
  await collection.parse(requestInfo)

  // Return a formatted JSON response
  const response = collection.getFormattedResponse()

  // Clear any existing scroll sessions if no items were returned
  const { cursor, items } = response
  if (cursor && !items.length) {
    await collection.clearScrollSessions(cursor)
  }

  return response
}
