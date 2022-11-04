import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'

export default async (params, context, parsedInfo) => {
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
