import { parseRequestedFields } from '../utils/parseRequestedFields'

import granuleKeyMap from '../utils/umm/granuleKeyMap.json'

import Granule from '../cmr/concepts/granule'

export default async (params, headers, parsedInfo) => {
  const requestInfo = parseRequestedFields(parsedInfo, granuleKeyMap, 'granule')

  const granule = new Granule(headers, requestInfo, params)

  // Query CMR
  granule.fetch(params)

  // Parse the response from CMR
  await granule.parse(requestInfo)

  // Return a formatted JSON response
  const response = granule.getFormattedResponse()

  // Clear any existing scroll sessions if no items were returned
  const { cursor, items } = response
  if (cursor && !items.length) {
    await granule.clearScrollSessions(cursor)
  }

  return response
}
